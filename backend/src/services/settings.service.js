const { getMySqlPromiseConnection } = require("../config/mysql.db")

exports.getCurrencyDB = async () => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        SELECT
            currency
        FROM
            store_details
        LIMIT 1;
        `;
    
        const [result] = await conn.query(sql);
        return result[0].currency;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.getStoreSettingDB = async () => {
    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        SELECT id, store_name, address, phone, email, currency, image FROM store_details
        WHERE id = 1
        LIMIT 1;
        `;

        const [result] = await conn.query(sql);
        return result[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.setStoreSettingDB = async (storeName, address, phone, email, currency) => {
    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        INSERT INTO store_details (id, store_name, address, phone, email, currency) 
        VALUES
        (1, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        store_name = VALUES(store_name),
        address = VALUES(address),
        phone = VALUES(phone),
        email = VALUES(email),
        currency = VALUES(currency);
        `;

        await conn.query(sql, [storeName, address, phone, email, currency]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.getPrintSettingDB = async () => {
    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        SELECT id, page_format, header, footer, show_notes, is_enable_print, show_store_details, show_customer_details, print_token FROM print_settings
        WHERE id = 1
        LIMIT 1;
        `;

        const [result] = await conn.query(sql);
        return result[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.setPrintSettingDB = async (pageFormat, header, footer, showNotes, isEnablePrint, showStoreDetails, showCustomerDetails, printToken) => {
    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        INSERT INTO print_settings
        (id, page_format, header, footer, show_notes, is_enable_print, show_store_details, show_customer_details, print_token)
        VALUES
        (1, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        page_format = VALUES(page_format), 
        header = VALUES(header), 
        footer = VALUES(footer), 
        show_notes = VALUES(show_notes), 
        is_enable_print = VALUES(is_enable_print), 
        show_store_details = VALUES(show_store_details), 
        show_customer_details = VALUES(show_customer_details), 
        print_token = VALUES(print_token);
        `;

        await conn.query(sql, [pageFormat, header, footer, showNotes, isEnablePrint, showStoreDetails, showCustomerDetails, printToken]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.addTaxDB = async (title, rate, type) => {
    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        INSERT INTO taxes 
        (title, rate, type)
        VALUES (?, ?, ?);
        `;

        const [result] = await conn.query(sql, [title, rate, type]);
        return result.insertId;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.getTaxesDB = async () => {
    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        SELECT id, title, rate, type FROM taxes;
        `;

        const [result] = await conn.query(sql);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.getTaxDB = async (taxId) => {
    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        SELECT id, title, rate, type FROM taxes
        WHERE id = ?
        LIMIT 1;
        `;

        const [result] = await conn.query(sql, [taxId]);
        return result[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.deleteTaxDB = async (id) => {
    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        DELETE FROM taxes WHERE id = ?;
        `;

        await conn.query(sql, [id]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.updateTaxDB = async (id, title, rate, type) => {
    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        UPDATE taxes 
        SET
        title = ?, rate = ?, type = ?
        WHERE id = ?
        `;

        await conn.query(sql, [title, rate, type, id]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


exports.addPaymentTypeDB = async (title, isActive) => {
    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        INSERT INTO payment_types
        (title, is_active)
        VALUES (?, ?);
        `;

        const [result] = await conn.query(sql, [title, isActive]);
        return result.insertId;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.getPaymentTypesDB = async (activeOnly=false) => {
    const conn = getMySqlPromiseConnection();

    try {
        let sql = `
        SELECT id, title, is_active FROM payment_types;
        `;

        if(activeOnly) {
            sql = `
            SELECT id, title, is_active FROM payment_types
            WHERE is_active = 1;
            `
        }

        const [result] = await conn.query(sql);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.updatePaymentTypeDB = async (id, title, isActive) => {
    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        UPDATE payment_types
        SET title = ?, is_active = ?
        WHERE id = ?;
        `;

        const [result] = await conn.query(sql, [title, isActive, id]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.togglePaymentTypeDB = async (id, isActive) => {
    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        UPDATE payment_types
        SET is_active = ?
        WHERE id = ?;
        `;

        const [result] = await conn.query(sql, [isActive, id]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.deletePaymentTypeDB = async (id) => {
    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        DELETE FROM payment_types
        WHERE id = ?;
        `;

        await conn.query(sql, [id]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.addStoreTableDB = async (title, floor, seatingCapacity) => {
    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        INSERT INTO store_tables
        (table_title, floor, seating_capacity)
        VALUES (?, ?, ?);
        `;

        const [result] = await conn.query(sql, [title, floor, seatingCapacity]);
        return result.insertId;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.getStoreTablesDB = async () => {
    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        SELECT id, table_title, floor, seating_capacity FROM store_tables;
        `;

        const [result] = await conn.query(sql, []);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.updateStoreTableDB = async (id, title, floor, seatingCapacity) => {
    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        UPDATE store_tables SET
        table_title = ?, floor = ?, seating_capacity = ?
        WHERE id = ?;
        `;

        await conn.query(sql, [title, floor, seatingCapacity, id]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.deleteStoreTableDB = async (id) => {
    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        DELETE FROM store_tables
        WHERE id = ?;
        `;

        await conn.query(sql, [id]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.addCategoryDB = async (title) => {
    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        INSERT INTO categories 
        (title)
        VALUES (?);
        `;

        const [result] = await conn.query(sql, [title]);
        return result.insertId;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.getCategoriesDB = async () => {
    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        SELECT id, title FROM categories;
        `;

        const [result] = await conn.query(sql, []);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.updateCategoryDB = async (id, title) => {
    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        UPDATE categories 
        SET title = ?
        WHERE id = ?;
        `;

        await conn.query(sql, [title, id]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.deleteCategoryDB = async (id) => {
    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        DELETE FROM categories 
        WHERE id = ?;
        `;

        await conn.query(sql, [id]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};