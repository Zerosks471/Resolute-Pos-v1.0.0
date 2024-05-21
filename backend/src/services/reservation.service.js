const { getMySqlPromiseConnection } = require("../config/mysql.db")

exports.addReservationDB = async (customerId, date, tableId, status, notes, peopleCount, uniqueCode) => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        INSERT INTO reservations 
        (customer_id, date, table_id, status, notes, people_count, unique_code)
        VALUES
        (?, ?, ?, ?, ?, ?, ?);
        `;

        const [result] = await conn.query(sql, [customerId, date, tableId, status, notes, peopleCount, uniqueCode]);
        return result.insertId;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.updateReservationDB = async (reservationId, date, tableId, status, notes, peopleCount) => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        UPDATE reservations 
        SET
        date = ?, table_id = ?, status = ?, notes = ?, people_count = ?, updated_at = NOW()
        WHERE id = ?;
        `;

        await conn.query(sql, [date, tableId, status, notes, peopleCount, reservationId]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.cancelReservationDB = async (reservationId, status) => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        UPDATE reservations 
        SET
        status = ?
        WHERE id = ?;
        `;

        await conn.query(sql, [status, reservationId]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.deleteReservationDB = async (reservationId) => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        DELETE FROM reservations 
        WHERE id = ?;
        `;

        await conn.query(sql, [reservationId]);
        return;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.searchReservationsDB = async (search) => {
    try {
        const conn = getMySqlPromiseConnection();

        const sql = `
        SELECT r.id, customer_id, c.name as customer_name, r.date, table_id, st.table_title, status, notes, people_count, unique_code, r.created_at, r.updated_at
        FROM reservations r
        LEFT JOIN customers c
        ON r.customer_id = c.phone
        LEFT JOIN store_tables st
        ON r.table_id = st.id
        WHERE r.id = ? OR customer_id = ? OR unique_code = ?
        ORDER BY r.created_at DESC
        LIMIT 20;
        `;

        const [results] = await conn.query(sql, [search, search, search]);
        return results;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.getReservationsDB = async (type, from, to) => {
    try {
        const conn = getMySqlPromiseConnection();

        const {filter, params} = getFilterConditionForReservationSearch(type, from, to);

        const sql = `
        SELECT r.id, customer_id, c.name as customer_name, r.date, table_id, st.table_title, status, notes, people_count, unique_code, r.created_at, r.updated_at
        FROM reservations r
        LEFT JOIN customers c
        ON r.customer_id = c.phone
        LEFT JOIN store_tables st
        ON r.table_id = st.id
        WHERE ${filter}
        `;

        const [results] = await conn.query(sql, params);
        return results;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getFilterConditionForReservationSearch = (type, from, to) => {
    const params = [];
    let filter = '';

    switch (type) {
        case 'custom': {
            params.push(from, to);
            filter = `DATE(date) >= ? AND DATE(date) <= ?`;
            break;
        }
        case 'today': {
            filter = `DATE(date) = CURDATE()`;
            break;
        }
        case 'this_month': {
            filter = `YEAR(date) = YEAR(NOW()) AND MONTH(date) = MONTH(NOW())`;
            break;
        }
        case 'last_month': {
            filter = `DATE(date) >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND DATE(date) <= CURDATE()`;
            break;
        }
        case 'last_7days': {
            filter = `DATE(date) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND DATE(date) <= CURDATE()`;
            break;
        }
        case 'yesterday': {
            filter = `DATE(date) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)`;
            break;
        }
        case 'tomorrow': {
            filter = `DATE(date) = DATE_ADD(CURDATE(), INTERVAL 1 DAY)`;
            break;
        }
        default: {
            filter = '';
        }
    }

    return { params, filter };
}