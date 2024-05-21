const { CONFIG } = require("./index")

const mySqlPromise = require("mysql2/promise");

const pool = mySqlPromise.createPool(`${CONFIG.DATABASE_URL}?ssl={"rejectUnauthorized":false}&multipleStatements=true&dateStrings=true`);

console.log(`DB Pool Created.`);

exports.getMySqlPromiseConnection = () => {
  try {
    return pool;
  } catch (error) {
    throw error;
  }
};