require("dotenv").config({ path: `${__dirname}/../.env` });
const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_HOST,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

exports.execSql = async function (sqlquery) {
  const pool = new sql.ConnectionPool(config);
  pool.on("error", (err) => {
    console.error(err);
    console.log("sql errors", err);
  });

  try {
    await pool.connect();
    let result = await pool.request().query(sqlquery);
    return result;
  } catch (err) {
    return { err: err };
  } finally {
    pool.close(); //closing connection after request is finished.
  }
};
