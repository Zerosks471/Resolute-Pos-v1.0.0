const { getMySqlPromiseConnection } = require("../config/mysql.db")

exports.addMenuItemDB = async (title, price, netPrice, taxId, categoryId, image) => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        INSERT INTO menu_items
        (title, price, net_price, tax_id, category, image)
        VALUES
        (?, ?, ?, ?, ?, ?);
        `;

        const [result] = await conn.query(sql, [title, price, netPrice, taxId, categoryId, image]);
        return result.insertId;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

exports.updateMenuItemDB = async (id, title, price, netPrice, taxId, categoryId, image) => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        UPDATE menu_items SET
        title = ?, price = ?, net_price = ?, tax_id = ?, category = ?, image = ?
        WHERE id = ?;
        `;

        await conn.query(sql, [title, price, netPrice, taxId, categoryId, image, id]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

exports.deleteMenuItemDB = async (id) => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        DELETE FROM menu_items 
        WHERE id = ?;
        `;

        await conn.query(sql, [id]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

exports.getAllMenuItemsDB = async () => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        SELECT 
        i.id, i.title, price, net_price, tax_id, t.title AS tax_title, t.rate AS tax_rate, t.type AS tax_type, category as category_id, c.title AS category_title, image
        FROM menu_items i
        LEFT JOIN taxes t
        ON i.tax_id = t.id
        LEFT JOIN categories c
        ON i.category = c.id;
        `;

        const [result] = await conn.query(sql, []);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

exports.getMenuItemDB = async (id) => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        SELECT 
        i.id, i.title, price, net_price, tax_id, t.title AS tax_title, t.rate AS tax_rate, t.type AS tax_type, category as category_id, c.title AS category_title, image
        FROM menu_items i
        LEFT JOIN taxes t
        ON i.tax_id = t.id
        LEFT JOIN categories c
        ON i.category = c.id
        WHERE i.id = ?
        `;

        const [result] = await conn.query(sql, [id]);
        return result[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * @param {number} itemId Menu Item ID to add Addon
 * @param {string} title Title of Addon
 * @param {number} price Additonal Price for addon, Put 0 / null to make addon as free option
 * @returns {Promise<number>}
 *  */ 
exports.addMenuItemAddonDB = async (itemId, title, price) => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        INSERT INTO menu_item_addons
        (item_id, title, price)
        VALUES
        (?, ?, ?);
        `;

        const [result] = await conn.query(sql, [itemId, title, price]);
        return result.insertId;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/**
 * @param {number} itemId Menu Item ID 
 * @param {number} addonId Addon ID 
 * @param {string} title Title of Addon
 * @param {number} price Additonal Price for addon, Put 0 / null to make addon as free option
 * @returns {Promise<void>}
 *  */ 
exports.updateMenuItemAddonDB = async (itemId, addonId, title, price) => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        UPDATE menu_item_addons
        SET
        title = ?, price = ?
        WHERE id = ? AND item_id = ?
        `;

        await conn.query(sql, [title, price, addonId, itemId]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/**
 * @param {number} itemId Menu Item ID 
 * @param {number} addonId Addon ID 
 * @returns {Promise<void>}
 *  */ 
exports.deleteMenuItemAddonDB = async (itemId, addonId) => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        DELETE FROM menu_item_addons
        WHERE id = ? AND item_id = ?;
        `;

        await conn.query(sql, [addonId, itemId]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/**
 * @param {number} itemId Menu Item ID 
 * @param {number} addonId Addon ID 
 * @returns {Promise<Array>}
 *  */ 
exports.getMenuItemAddonsDB = async (itemId) => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        SELECT id, item_id, title, price FROM menu_item_addons
        WHERE item_id = ?;
        `;

        const [result] = await conn.query(sql, [itemId]);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.getAllAddonsDB = async () => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        SELECT id, item_id, title, price FROM menu_item_addons;
        `;

        const [result] = await conn.query(sql, []);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/**
 * @param {number} itemId Menu Item ID to add Variant
 * @param {string} title Title of Variant
 * @param {number} price Additonal Price for Variant, Put 0 / null to make Variant as free option
 * @returns {Promise<number>}
 *  */ 
exports.addMenuItemVariantDB = async (itemId, title, price) => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        INSERT INTO menu_item_variants
        (item_id, title, price)
        VALUES
        (?, ?, ?);
        `;

        const [result] = await conn.query(sql, [itemId, title, price]);
        return result.insertId;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.updateMenuItemVariantDB = async (itemId, variantId, title, price) => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        UPDATE menu_item_variants
        SET
        title = ?, price = ?
        WHERE item_id = ? AND id = ?
        `;

        await conn.query(sql, [title, price, itemId, variantId]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.deleteMenuItemVariantDB = async (itemId, variantId) => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        DELETE FROM menu_item_variants
        WHERE item_id = ? AND id = ?
        `;

        await conn.query(sql, [itemId, variantId]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.getMenuItemVariantsDB = async (itemId) => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        SELECT id, item_id, title, price FROM menu_item_variants
        WHERE item_id = ?;
        `;

        const [result] = await conn.query(sql, [itemId]);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
exports.getAllVariantsDB = async () => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        SELECT id, item_id, title, price FROM menu_item_variants;
        `;

        const [result] = await conn.query(sql, []);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};