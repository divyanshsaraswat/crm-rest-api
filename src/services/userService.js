const { poolPromise } = require('../db/sqlConfig');

exports.getUsers = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM Users');
  return result.recordset;
};