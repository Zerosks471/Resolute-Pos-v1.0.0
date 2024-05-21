const bcrypt = require("bcrypt");
const { CONFIG } = require("../config/index")
const { getMySqlPromiseConnection } = require("../config/mysql.db")
exports.signInDB = async (username, password) => {

    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        SELECT username, password, name, role, photo, designation, phone, email, scope FROM users
        WHERE username = ?
        LIMIT 1;
        `;

        const [result] = await conn.query(sql, [username]);
        const user = result[0];

        if(!user) {
            return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if(passwordMatch) {
            return user;
        } else {
            return null;
        }

    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.addRefreshTokenDB = async (username, refreshToken, expiry, deviceIP, deviceName, deviceLocation) => {

    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        INSERT INTO refresh_tokens (username, refresh_token, device_ip, device_name, device_location, expiry) 
        VALUES (?, ?, ?, ?, ?, ?);
        `;

        const [result] = await conn.query(sql, [username, refreshToken, deviceIP, deviceName, deviceLocation, expiry]);
        return result.insertId;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.removeRefreshTokenDB = async (username, refreshToken) => {

    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        DELETE FROM refresh_tokens 
        WHERE username = ? AND refresh_token = ?;
        DELETE FROM refresh_tokens 
        WHERE username = ? AND expiry < CURDATE();
        `;

        await conn.query(sql, [username, refreshToken, username]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.removeRefreshTokenByDeviceIdDB = async (username, deviceId) => {

    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        DELETE FROM refresh_tokens 
        WHERE username = ? AND device_id = ?;
        DELETE FROM refresh_tokens 
        WHERE username = ? AND expiry < CURDATE();
        `;

        await conn.query(sql, [username, deviceId, username]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


exports.getDevicesDB = async (username) => {

    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        SELECT device_id, refresh_token, device_ip, device_name, device_location, created_at FROM refresh_tokens 
        WHERE username = ?;
        `;

        const [results] = await conn.query(sql, [username]);
        return results;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.verifyRefreshTokenDB = async (refreshToken) => {

    const conn = getMySqlPromiseConnection();

    try {
        const sql = `
        SELECT username, refresh_token FROM refresh_tokens 
        WHERE refresh_token = ?
        LIMIT 1;
        `;

        const [result] = await conn.query(sql, [refreshToken]);
        return result[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
};