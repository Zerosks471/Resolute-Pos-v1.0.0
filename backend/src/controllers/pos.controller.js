const {
  getCategoriesDB,
  getPaymentTypesDB,
  getPrintSettingDB,
  getStoreSettingDB,
  getStoreTablesDB,
} = require("../services/settings.service");
const {
  getAllMenuItemsDB,
  getAllAddonsDB,
  getAllVariantsDB,
} = require("../services/menu_item.service");
const { createOrderDB } = require("../services/pos.service");
const { createInvoiceDB } = require("../services/orders.service");

exports.getPOSInitData = async (req, res) => {
  try {
    const [categories, paymentTypes, printSettings, storeSettings, storeTables] = await Promise.all([
      getCategoriesDB(),
      getPaymentTypesDB(true),
      getPrintSettingDB(),
      getStoreSettingDB(),
      getStoreTablesDB()
    ]);

    const [menuItems, addons, variants] = await Promise.all([
      getAllMenuItemsDB(),
      getAllAddonsDB(),
      getAllVariantsDB(),
    ]);

    const formattedMenuItems = menuItems.map((item) => {
      const itemAddons = addons.filter((addon) => addon.item_id == item.id);
      const itemVariants = variants.filter(
        (variant) => variant.item_id == item.id
      );

      return {
        ...item,
        addons: [...itemAddons],
        variants: [...itemVariants],
      };
    });

    return res.status(200).json({
      categories,
      paymentTypes,
      printSettings,
      storeSettings,
      storeTables,
      menuItems: formattedMenuItems,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try later!",
    });
  }
};

exports.createOrder = async (req, res) => {

  try {
    const {cart, deliveryType, customerType, customerId, tableId} = req.body;

    if(cart?.length == 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty!"
      });
    }

    const result = await createOrderDB(cart, deliveryType, customerType, customerId?.phone || null, tableId || null);

    // step 8: send event to all subscriber through socket
    

    return res.status(200).json({
      success: true,
      message: `Order created. Token: ${result.tokenNo}`,
      tokenNo: result.tokenNo,
      orderId: result.orderId,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error processing the request, please try after sometime!"
    });
  }

};

exports.createOrderAndInvoice = async (req, res) => {

  try {
    const {cart, deliveryType, customerType, customerId, tableId, netTotal, taxTotal, total} = req.body;

    if(cart?.length == 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty!"
      });
    }

    // create invoice
    const now = new Date();
    const date = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const invoiceId = await createInvoiceDB(netTotal, taxTotal, total, date);
    // create invoice

    const result = await createOrderDB(cart, deliveryType, customerType, customerId?.phone || null, tableId || null, 'paid', invoiceId);
    const orderId = result.orderId;
    const tokenNo = result.tokenNo;

    // step 8: send event to all subscriber through socket
    

    return res.status(200).json({
      success: true,
      message: `Order created. Token: ${tokenNo}`,
      tokenNo,
      orderId,
      invoiceId
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error processing the request, please try after sometime!"
    });
  }

};