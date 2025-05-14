const { poolPromise } = require('../db/sqlConfig');
const {hashPassword,comparePassword} = require('../services/utilities/passwordhash');
const {generateToken} = require('../services/utilities/jwtsign');


exports.getContacts = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * from Contacts;');
  return result.recordsets;
};
exports.insertContact = async (contact) => {
  const pool = await poolPromise;
  const { first_name, last_name, email, phone,account_id, pid } = contact;

  const result = await pool
    .request()
    .input('first_name', first_name? first_name : '')
    .input('last_name', last_name)
    .input('email', email? email : '')
    .input('phone', phone? phone : '')
    .input('account_id', account_id)
    .input('id', pid)
    .query('INSERT INTO Contacts (first_name, last_name, email, phone, account_id,contact_owner_id) VALUES (@first_name, @last_name, @email, @phone, @account_id,@id);');
  return result.rowsAffected;
}

exports.deleteContact = async (id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('id', id)
    .query('DELETE FROM Contacts WHERE id = @id;');
  return result.rowsAffected;
};