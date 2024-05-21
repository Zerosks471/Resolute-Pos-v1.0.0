const { getMySqlPromiseConnection } = require("../config/mysql.db")

exports.getUserDB = async (username) => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        SELECT username, role, scope FROM users
        WHERE username = ?
        LIMIT 1;
        `;
    
        const [result] = await conn.query(sql, [username]);
        return result[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.getAllUsersDB = async () => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        SELECT username, name, role, photo, designation, phone, email, scope FROM users
        ORDER BY role, name;
        `;
    
        const [result] = await conn.query(sql, []);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.doUserExistDB = async (username) => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        SELECT username FROM users
        WHERE username = ?
        LIMIT 1;
        `;
    
        const [result] = await conn.query(sql, [username]);
        return result.length == 1;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.addUserDB = async (username, encryptedPassword, name, role, photo, designation, phone, email, scope) => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        INSERT INTO users
        (username, password, name, role, photo, designation, phone, email, scope)
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await conn.query(sql, [username, encryptedPassword, name, role, photo, designation, phone, email, scope]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.deleteUserDB = async (username) => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        DELETE FROM refresh_tokens WHERE username = ?;
        DELETE FROM users WHERE username = ?;
        `;

        await conn.query(sql, [username, username]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.deleteUserRefreshTokensDB = async (username) => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        DELETE FROM refresh_tokens WHERE username = ?;
        `;

        await conn.query(sql, [username]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.updateUserDB = async (username, name, photo, designation, phone, email, scope) => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        UPDATE users
        SET
        name = ?, photo = ?, designation = ?, phone = ?, email = ?, scope = ?
        WHERE username = ?;
        `;

        await conn.query(sql, [name, photo, designation, phone, email, scope, username]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.updateUserPasswordDB = async (username, password) => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        UPDATE users
        SET
        password = ?
        WHERE username = ?;
        `;

        await conn.query(sql, [password, username]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};