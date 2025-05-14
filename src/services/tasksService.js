const { send } = require('node:process');
const { poolPromise } = require('../db/sqlConfig');



exports.getTasks = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * from Tasks;');
  return result.recordsets;
};

exports.getTaskById = async (id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('id', id)
    .query('SELECT * from Tasks WHERE id = @id;');
  return result.recordset[0];
}

exports.deleteTask = async (id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('id', id)
    .query('DELETE FROM Tasks WHERE id = @id;');
  return result.rowsAffected;
}
exports.insertTask = async (account) => {
  const pool = await poolPromise;
  const { subject, body, status, due_date, sender_email, contact_id ,pid } = account;

  const result = await pool
    .request()
    .input('subject', subject)
    .input('body', body?body:'')
    .input('status', status)
    .input('due_date', due_date?due_date:'')
    .input('sender_email', sender_email?sender_email:'')
    .input('contact_id', contact_id)
    .input('assigned_user', pid)
    .query('INSERT INTO Tasks (subject,body,status,due_date,sender_email,contact_id,assigned_user_id) VALUES (@subject,@body,@status,@due_date,@sender_email,@contact_id,@assigned_user);');
  return result.rowsAffected;
}
