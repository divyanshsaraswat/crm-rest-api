const { poolPromise } = require('../db/sqlConfig');
const {hashPassword,comparePassword} = require('../services/utilities/passwordhash');
const {generateToken} = require('../services/utilities/jwtsign');
exports.getUsers = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * from Users;');
  return result.recordsets;
};

exports.getUserById = async (id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', id)
    .query('SELECT * from Users WHERE id = @id;');
  return result.recordset[0];
}

exports.insertUser = async (user) => {
  const pool = await poolPromise;
  const { username, email, password } = user;
  const hashedPassword = await hashPassword(password);
  const result = await pool
    .request()
    .input('username',username)
    .input('email',email)
    .input('password',hashedPassword)
    .query('INSERT INTO Users (username, email, password_hash) VALUES (@username, @email, @password);');
  return result.rowsAffected;
}

exports.deleteUser = async (id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('id', id)
    .query('DELETE FROM Users WHERE id = @id;');
  return result.rowsAffected;
}
exports.checkcmd = async (query) => {
  const pool = await poolPromise;
  const result = await pool
    .request()

    .query(query);
  return result.recordset;
}
exports.login = async (username,password) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('username', username)
    .query('SELECT password_hash,role,id FROM Users WHERE username = @username;');
  const check = comparePassword(password,result.recordset[0].password_hash);
  if (check){
    const token = generateToken(result.recordset[0].id,result.recordset[0].role);
    return token;
  }
  return false;
  
  
}

// exports.updateUser = async (user) => {
//   const pool = await poolPromise;
//   const { id, username, email, password } = user;
//   const result = await pool
//     .request()
//     .input('id', id)
//     .input('username', username)
//     .input('email', email)
//     .input('password', password)
//     .query('UPDATE Users SET username = @username, email = @email, password_hash = @password WHERE id = @id;');
//   return result.rowsAffected;
// }