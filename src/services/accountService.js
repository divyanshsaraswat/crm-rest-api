const { poolPromise } = require('../db/sqlConfig');
const {hashPassword,comparePassword} = require('../services/utilities/passwordhash');
const {generateToken} = require('../services/utilities/jwtsign');


exports.getAccounts = async (data) => {
  const pool = await poolPromise;

  const {pid, role} = data;

  let result;
  if (role=="admin"){
     result = await pool.request().query('SELECT * from Accounts;');
  }
  if (role=="user" || role=="manager"){
    result = await pool.request()
      .input('id', pid)
      .query('SELECT u.* FROM Accounts u INNER JOIN Accounts p ON u.assigned_user_id = p.assigned_user_id WHERE p.id = @id;')
  }
  return result.recordsets;
};


exports.getAccountById = async (id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', id)
    .query('SELECT u.* FROM Accounts u INNER JOIN Accounts p ON u.assigned_user_id = p.assigned_user_id WHERE u.id = @id;')
  return result.recordset[0];
}

exports.deleteAccount = async (id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('id', id)
    .query('DELETE FROM Accounts WHERE id = @id;');
  return result.rowsAffected;
}
exports.insertAccount = async (account) => {
  const pool = await poolPromise;
  const { account_name, website, industry,status,source,pid } = account;

  const result = await pool
    .request()
    .input('account_name', account_name)
    .input('website', website?website:'')
    .input('industry', industry?industry:'')
    .input('status', status?status:'')
    .input('source', source?source:'')
    .input('assigned_user', pid)
    .query('INSERT INTO Accounts (name,industry,status,source,assigned_user_id) VALUES (@account_name,@industry,@status,@source,@assigned_user);');
  return result.rowsAffected;
}
