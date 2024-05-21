const { getMySqlPromiseConnection } = require("../config/mysql.db")

exports.getInvoicesDB = async (type, from, to) => {
    try {
        const conn = getMySqlPromiseConnection();

        const {filter, params} = getFilterConditionForInvoices(type, from, to)

        const sql = `
        SELECT
            o.invoice_id,
            o.id AS order_id,
            i.created_at,
            i.sub_total,
            i.tax_total,
            i.total,
            o.table_id,
            st.table_title,
            st.\`floor\`,
            o.payment_status,
            o.token_no,
            o.delivery_type,
            o.customer_type,
            o.customer_id,
            c.\`name\`,
            c.email
        FROM
            orders o
            INNER JOIN invoices i ON o.invoice_id = i.id
            LEFT JOIN customers c ON o.customer_id = c.phone
            LEFT JOIN store_tables st ON o.table_id = st.id
        WHERE ${filter}
        ORDER BY
            i.created_at DESC
        `;

        const [results] = await conn.query(sql, params);
        return results;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
const getFilterConditionForInvoices = (type, from, to) => {
    const params = [];
    let filter = '';

    switch (type) {
        case 'custom': {
            params.push(from, to);
            filter = `DATE(i.created_at) >= ? AND DATE(i.created_at) <= ?`;
            break;
        }
        case 'today': {
            filter = `DATE(i.created_at) = CURDATE()`;
            break;
        }
        case 'this_month': {
            filter = `YEAR(i.created_at) = YEAR(NOW()) AND MONTH(i.created_at) = MONTH(NOW())`;
            break;
        }
        case 'last_month': {
            filter = `DATE(i.created_at) >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND DATE(i.created_at) <= CURDATE()`;
            break;
        }
        case 'last_7days': {
            filter = `DATE(i.created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DATE(i.created_at) <= CURDATE()`;
            break;
        }
        case 'yesterday': {
            filter = `DATE(i.created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)`;
            break;
        }
        case 'tomorrow': {
            filter = `DATE(i.created_at) = DATE_ADD(CURDATE(), INTERVAL 1 DAY)`;
            break;
        }
        default: {
            filter = '';
        }
    }

    return { params, filter };
}

exports.searchInvoicesDB = async (search) => {
  try {
    const conn = getMySqlPromiseConnection();

    const sql = `
    SELECT
      o.invoice_id,
      o.id AS order_id,
      i.created_at,
      i.sub_total,
      i.tax_total,
      i.total,
      o.table_id,
      st.table_title,
      st.\`floor\`,
      o.payment_status,
      o.token_no,
      o.delivery_type,
      o.customer_type,
      o.customer_id,
      c.\`name\`,
      c.email
    FROM
      orders o
      INNER JOIN invoices i ON o.invoice_id = i.id
      LEFT JOIN customers c ON o.customer_id = c.phone
      LEFT JOIN store_tables st ON o.table_id = st.id
    WHERE o.invoice_id = ? OR o.id = ? OR o.customer_id LIKE ? OR c.\`name\` LIKE ?
    ORDER BY
      i.created_at DESC
    LIMIT 20
    `;

    const [results] = await conn.query(sql, [search, search, search, `%${search}%`]);
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


exports.getInvoiceOrdersDB = async (orderIdsToFindSummary) => {
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
        o.status NOT IN ('cancelled')
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