const { getMySqlPromiseConnection } = require("../config/mysql.db")

exports.getOrdersCountDB = async (type, from, to) => {
    try {
        const conn = getMySqlPromiseConnection();

        const {filter, params} = getFilterCondition('date', type, from, to);

        const sql = `
        SELECT
            count(*) AS todays_orders
        FROM
            orders
        WHERE
            ${filter}
        `;
    
        const [result] = await conn.query(sql, params);
        return result[0].todays_orders;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


exports.getNewCustomerCountDB = async (type, from, to) => {
    try {
        const conn = getMySqlPromiseConnection();

        const {filter, params} = getFilterCondition('created_at', type, from, to);

        const sql = `
        SELECT
            count(*) AS new_customers_count
        FROM
            customers
        WHERE
            ${filter}
        `;
    
        const [result] = await conn.query(sql, params);
        return result[0].new_customers_count;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.getRepeatCustomerCountDB = async (type, from, to) => {
    try {
        const conn = getMySqlPromiseConnection();

        const {filter, params} = getFilterCondition('date', type, from, to);

        const sql = `
        SELECT
            COUNT(*) as todays_repeat_customers
        FROM
            orders
        WHERE
            ${filter}
            AND customer_type = 'CUSTOMER';
        `;
    
        const [result] = await conn.query(sql, params);
        return result[0].todays_repeat_customers;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.getAverageOrderValueDB = async (type, from, to) => {
    try {
        const conn = getMySqlPromiseConnection();

        const {filter, params} = getFilterCondition('created_at', type, from, to);

        const sql = `
        SELECT
            avg(total) AS avg_order_value
        FROM
            invoices
        WHERE    
            ${filter}
        `;
    
        const [result] = await conn.query(sql, params);
        return result[0].avg_order_value;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.getTotalCustomersDB = async () => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        SELECT
            count(*) AS total_customer
        FROM
            customers;
        `;
    
        const [result] = await conn.query(sql);
        return result[0].total_customer;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.getRevenueDB = async (type, from, to) => {
    try {
        const conn = getMySqlPromiseConnection();

        const {filter, params} = getFilterCondition('created_at', type, from, to);

        const sql = `
        SELECT
            SUM(total) AS total_revenue
        FROM
            invoices
        WHERE 
            ${filter}
        `;
    
        const [result] = await conn.query(sql, params);
        return result[0].total_revenue;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.getTotalTaxDB = async (type, from, to) => {
    try {
        const conn = getMySqlPromiseConnection();

        const {filter, params} = getFilterCondition('created_at', type, from, to);

        const sql = `
        SELECT
            SUM(tax_total) AS total_tax
        FROM
            invoices
        WHERE
            ${filter}
        `;
    
        const [result] = await conn.query(sql, params);
        return result[0].total_tax;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.getTotalNetRevenueDB = async (type, from, to) => {
    try {
        const conn = getMySqlPromiseConnection();

        const {filter, params} = getFilterCondition('created_at', type, from, to);

        const sql = `
        SELECT
            SUM(sub_total) AS total_net_revenue
        FROM
            invoices
        WHERE
            ${filter}
        `;
    
        const [result] = await conn.query(sql, params);
        return result[0].total_net_revenue;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


const getFilterCondition = (field, type, from, to) => {
    const params = [];
    let filter = '';

    switch (type) {
        case 'custom': {
            params.push(from, to);
            filter = `DATE(${field}) >= ? AND DATE(${field}) <= ?`;
            break;
        }
        case 'today': {
            filter = `DATE(${field}) = CURDATE()`;
            break;
        }
        case 'this_month': {
            filter = `YEAR(${field}) = YEAR(NOW()) AND MONTH(${field}) = MONTH(NOW())`;
            break;
        }
        case 'last_month': {
            // filter = `DATE(${field}) >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND DATE(${field}) <= CURDATE()`;
            filter = `MONTH(${field}) = MONTH(DATE_ADD(NOW(), INTERVAL -1 MONTH)) AND YEAR(${field}) = YEAR(DATE_ADD(NOW(), INTERVAL -1 MONTH))`;
            break;
        }
        case 'last_7days': {
            filter = `DATE(${field}) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DATE(${field}) <= CURDATE()`;
            break;
        }
        case 'yesterday': {
            filter = `DATE(${field}) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)`;
            break;
        }
        case 'tomorrow': {
            filter = `DATE(${field}) = DATE_ADD(CURDATE(), INTERVAL 1 DAY)`;
            break;
        }
        default: {
            filter = '';
        }
    }

    return { params, filter };
}