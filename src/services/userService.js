const { poolPromise } = require('../db/sqlConfig');
const { Parser } = require('json2csv');
const {hashPassword,comparePassword} = require('../services/utilities/passwordhash');
const {generateToken} = require('../services/utilities/jwtsign');
exports.getUsers = async (data) => {
  const {pid, role} = data;
  const pool = await poolPromise;
  let result;
  if (role=="admin"){
    result = await pool.request().query('SELECT id,username,email,parent_id,created_at from Users;');
  }
  if (role=="user" || role=="manager"){
    result = await pool.request()
      .input('id', pid)
      .query('SELECT u.id,u.username,u.email,u.parent_id,u.created_at FROM Users u INNER JOIN Users p ON u.parent_id = p.parent_id WHERE p.id = @id;')
  }
  
  return result.recordsets;
};
exports.getDetails = async (pid)=>{
  const pool = await poolPromise;
  
  const result = await pool.request()
  .input('id',pid)
  .query('SELECT * FROM USERS WHERE ID=@id;')
  return result.recordset[0]
}
exports.getUserById = async (id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', id)
    .query('SELECT u.* FROM Users u INNER JOIN Users p ON u.parent_id = p.parent_id WHERE u.id = @id;')
  return result.recordset[0];
}

exports.insertUser = async (user) => {
  const pool = await poolPromise;
  const { username, email, password,userrole,pid } = user;
  const hashedPassword = await hashPassword(password);
  const result = await pool
    .request()
    .input('username',username)
    .input('email',email)
    .input('password',hashedPassword)
    .input('id', pid)
    .input('userrole', userrole? userrole : 'user')
    .query('INSERT INTO Users (username, email, password_hash,parent_id,role) VALUES (@username, @email, @password,@id,@userrole);');
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
exports.login = async (email,password) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('email', email)
    .query('SELECT password_hash,role,id FROM Users WHERE email = @email;');
  if (result.recordset.length === 0) {
    return false;
  }
  const check = comparePassword(password,result.recordset[0].password_hash);
  if (check){
    const token = generateToken(result.recordset[0].id,result.recordset[0].role);
    return token;
  }
  return false;
  
  
}
exports.downloadCSV = async (data) => {
   const json2csv = new Parser();
   const pool = await poolPromise;
   const idList = data.map(id => `'${id}'`).join(',');
   const result = await pool.request().query(`SELECT id,username,email,parent_id,created_at  FROM Users where id in (${idList})`);
  const csv = json2csv.parse(result.recordset);
  return csv;
  
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