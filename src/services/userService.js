const { poolPromise } = require('../db/sqlConfig');

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
  const result = await pool
    .request()
    .input('username',username)
    .input('email',email)
    .input('password',password)
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