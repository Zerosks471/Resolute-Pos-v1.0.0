const { getMySqlPromiseConnection } = require("../config/mysql.db");

// Function to add a transaction
// transactions.service.js

// transactions.service.js

exports.addTransactionDB = async (total, amountReceived, change, paymentMethod) => {
    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        INSERT INTO transactions (total, amount_received, change, payment_method)
        VALUES (?, ?, ?, ?);
        `;

        const [result] = await conn.query(sql, [total, amountReceived, change, paymentMethod]);
        return result.insertId;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Function to update a transaction
exports.updateTransactionDB = async (transactionId, total, amountReceived, paymentMethod) => {
    const conn = await getMySqlPromiseConnection().getConnection();
    try {
        const sql = `
        UPDATE transactions
        SET total = ?, amount_received = ?, payment_method = ?
        WHERE id = ?;
        `;
        await conn.query(sql, [total, amountReceived, paymentMethod, transactionId]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        conn.release();
    }
};

// Function to delete a transaction
exports.deleteTransactionDB = async (transactionId) => {
    const conn = await getMySqlPromiseConnection().getConnection();
    try {
        const sql = `
        DELETE FROM transactions
        WHERE id = ?;
        `;
        await conn.query(sql, [transactionId]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        conn.release();
    }
};

// Function to get all transactions
exports.getTransactionsDB = async () => {
    const conn = await getMySqlPromiseConnection().getConnection();
    try {
        const sql = `
        SELECT id, total, amount_received, payment_method, unique_code
        FROM transactions;
        `;
        const [result] = await conn.query(sql);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        conn.release();
    }
};

// Function to search for transactions
exports.searchTransactionsDB = async (searchString) => {
    const conn = await getMySqlPromiseConnection().getConnection();
    try {
        const sql = `
        SELECT id, total, amount_received, payment_method, unique_code
        FROM transactions
        WHERE unique_code LIKE ? OR payment_method LIKE ?;
        `;
        const [result] = await conn.query(sql, [`%${searchString}%`, `%${searchString}%`]);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        conn.release();
    }
};
