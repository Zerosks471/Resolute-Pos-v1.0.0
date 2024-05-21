const { getMySqlPromiseConnection } = require("../config/mysql.db")

exports.getOrdersDB = async () => {
  try {
    const conn = getMySqlPromiseConnection();

    const sql = `
    SELECT
      o.id,
      o.date,
      o.delivery_type,
      o.customer_type,
      o.customer_id,
      c. \`name\` AS customer_name,
      o.table_id,
      st.table_title,
      st. \`floor\`,
      o.status,
      o.payment_status,
      o.token_no
    FROM
      orders o
      LEFT JOIN customers c ON o.customer_id = c.phone
      LEFT JOIN store_tables st ON o.table_id = st.id
    WHERE
      date >= DATE_SUB(NOW(), INTERVAL 1 DAY)
      AND date <= DATE_ADD(NOW(), INTERVAL 1 DAY)
      AND o.status NOT IN ('completed', 'cancelled')
    `;

    const [kitchenOrders] = await conn.query(sql);

    let kitchenOrdersItems = [];
    let addons = [];

    if(kitchenOrders.length > 0) {
      const orderIds = kitchenOrders.map(o=>o.id).join(",");
      const sql2 = `
      SELECT
        oi.id,
        oi.order_id,
        oi.item_id,
        mi.title AS item_title,
        oi.variant_id,
        miv.title as variant_title,
        oi.price,
        oi.quantity,
        oi.status,
        oi.date,
        oi.addons,
        oi.notes
      FROM
        order_items oi
        LEFT JOIN menu_items mi ON oi.item_id = mi.id
        LEFT join menu_item_variants miv ON oi.item_id = miv.item_id AND oi.variant_id = miv.id
        
      WHERE oi.order_id IN (${orderIds})
      `
      const [kitchenOrdersItemsResult] = await conn.query(sql2);
      kitchenOrdersItems = kitchenOrdersItemsResult;

      const addonIds = [...new Set([...kitchenOrdersItems.flatMap((o)=>o.addons?JSON.parse(o?.addons):[])])].join(",");
      const [addonsResult] = addonIds ? await conn.query(`SELECT id, item_id, title FROM menu_item_addons WHERE id IN (${addonIds});`):[]
      addons = addonsResult;
    }

    return {
      kitchenOrders,
      kitchenOrdersItems,
      addons
    }
    
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updateOrderItemStatusDB = async (orderItemId, status) => {
  try {
    const conn = getMySqlPromiseConnection();

    const sql = `
    UPDATE order_items SET
    status = ?
    WHERE id = ?;
    `;

    await conn.query(sql, [status, orderItemId]);
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.cancelOrderDB = async (orderIds) => {
  try {
    const conn = getMySqlPromiseConnection();

    const orderIdsText = orderIds.join(",");

    const sql = `
    UPDATE orders SET
    status = 'cancelled'
    WHERE id IN (${orderIdsText});
    `;

    await conn.query(sql);
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.completeOrderDB = async (orderIds) => {
  try {
    const conn = getMySqlPromiseConnection();

    const orderIdsText = orderIds.join(",");

    const sql = `
    UPDATE orders SET
    status = 'completed'
    WHERE id IN (${orderIdsText});
    `;

    await conn.query(sql);
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getOrdersPaymentSummaryDB = async (orderIdsToFindSummary) => {
  try {
    const conn = getMySqlPromiseConnection();

    const sql = `
    SELECT
      o.id,
      o.date,
      o.delivery_type,
      o.customer_type,
      o.customer_id,
      c. \`name\` AS customer_name,
      o.table_id,
      st.table_title,
      st. \`floor\`,
      o.status,
      o.payment_status,
      o.token_no
    FROM
      orders o
      LEFT JOIN customers c ON o.customer_id = c.phone
      LEFT JOIN store_tables st ON o.table_id = st.id
    WHERE
      date >= DATE_SUB(NOW(), INTERVAL 1 DAY)
      AND date <= DATE_ADD(NOW(), INTERVAL 1 DAY)
      AND o.status NOT IN ('completed', 'cancelled')
      AND o.id IN (${orderIdsToFindSummary})
    `;

    const [kitchenOrders] = await conn.query(sql);

    let kitchenOrdersItems = [];
    let addons = [];

    if(kitchenOrders.length > 0) {
      const orderIds = kitchenOrders.map(o=>o.id).join(",");
      const sql2 = `
      SELECT
        oi.id,
        oi.order_id,
        oi.item_id,
        mi.title AS item_title,
        oi.variant_id,
        miv.title as variant_title,
        miv.price as variant_price,
        mi.price,
        mi.tax_id,
        t.title as tax_title,
        t.rate as tax_rate,
        t.type as tax_type,
        oi.quantity,
        oi.status,
        oi.date,
        oi.addons,
        oi.notes
      FROM
        order_items oi
        LEFT JOIN menu_items mi ON oi.item_id = mi.id
        LEFT JOIN menu_item_variants miv ON oi.item_id = miv.item_id AND oi.variant_id = miv.id
        LEFT JOIN taxes t ON mi.tax_id = t.id
        
      WHERE oi.order_id IN (${orderIds}) AND oi.status NOT IN ('cancelled')
      `
      const [kitchenOrdersItemsResult] = await conn.query(sql2);
      kitchenOrdersItems = kitchenOrdersItemsResult;

      const addonIds = [...new Set([...kitchenOrdersItems.flatMap((o)=>o.addons?JSON.parse(o?.addons):[])])].join(",");
      const [addonsResult] = addonIds ? await conn.query(`SELECT id, item_id, title, price FROM menu_item_addons WHERE id IN (${addonIds});`):[]
      addons = addonsResult;
    }

    return {
      kitchenOrders,
      kitchenOrdersItems,
      addons
    }
    
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.createInvoiceDB = async (subtotal, taxTotal, total, date) => {
  try {
    const conn = getMySqlPromiseConnection();

    const sql = `
    INSERT INTO invoices 
    (sub_total, tax_total, total, created_at) 
    VALUES
    (?, ?, ?, ?)
    `;

    const [result] = await conn.query(sql, [subtotal, taxTotal, total, date]);
    return result.insertId;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

exports.completeOrdersAndSaveInvoiceIdDB = async (orderIds, invoiceId) => {
  try {
    const conn = getMySqlPromiseConnection();

    const orderIdsText = orderIds.join(",");

    const sql = `
    UPDATE orders SET
    status = 'completed', payment_status = 'paid', invoice_id = ?
    WHERE id IN (${orderIdsText});
    `;

    await conn.query(sql, [invoiceId]);
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
}