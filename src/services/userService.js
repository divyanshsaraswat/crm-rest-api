const { poolPromise } = require('../db/sqlConfig');
const { Parser } = require('json2csv');
const {hashPassword,comparePassword} = require('../services/utilities/passwordhash');
const {generateToken} = require('../services/utilities/jwtsign');
exports.getUsers = async (data) => {
  const {pid, role,tenantid} = data;

  const pool = await poolPromise;
  let result;
  if (role=="admin"){
    result = await pool.request().input('tenant_id',tenantid).query('SELECT u.id,u.username,u.email,u.role,v.username as parent_id,u.created_at,u.tenant_id as Organisation_ID from Users u join Users v on u.parent_id=v.id where u.tenant_id=@tenant_id');
  }
  if (role=="user" || role=="manager"){
    result = await pool.request()
      .input('id', pid)
      .query('SELECT u.id,u.username,u.email,p.username,u.created_at FROM Users u INNER JOIN Users p ON u.parent_id = p.parent_id WHERE p.id = @id;')
  }
  
  return result.recordsets;
};
exports.getSignedDetails = async(data)=>{
  const pool = await poolPromise;
  const {pid} = data
  const result = await pool.request()
  .input('id',pid)
  .query(`select * from users where id=@id;`);
  return result.recordsets;


}
exports.updateSettings = async(data)=>{
  const pool = await poolPromise;
  const {
  pid,  
  pidnotify_email,
  notify_browser,
  notify_lead_alerts,
  notify_task_reminders,
  date_format,
  time_format,
  currency,
  theme,
  auto_refresh_interval} = data
  const result = await pool.request()
  .input('id',pid)
  .input('pidnotify_email',pidnotify_email)
  .input('notify_browser',notify_browser)
  .input('notify_lead_alerts',notify_lead_alerts)
  .input('notify_task_reminders',notify_task_reminders)
  .input('date_format',date_format)
  .input('currency',currency)
  .input('theme',theme)
  .input('time_format',time_format)
  .input('auto_refresh_interval',auto_refresh_interval)
  .query(`update user_settings set pidnotify_email=@pidnotifyemail,notify_browser=@notify_browser,notify_lead_alerts = @notify_lead_alerts,notify_task_reminders=@notify_task_reminders,date_format=@date_format,time_format=@time_format,currency=@currency,time_format=@time_format,theme=@theme,auto_refresh_interval=@auto_refresh_interval where user_id=@id;`)
  return result.rowsAffected;
}
exports.getSettings = async(data)=>{
  const pool = await poolPromise;
  const {pid} = data
  const result = await pool.request()
  .input('id',pid)
  .query(`select * from user_settings where user_id=@id;`);
  return result.recordsets;
}
exports.getRoles = async()=>{
  const pool = await poolPromise;
  const result = await pool.request().query('Select * from UserRoles;')
  return result.recordset
}
exports.getDetails = async (pid)=>{
  const pool = await poolPromise;
  
  const result = await pool.request()
  .input('id',pid)
  .query('SELECT * FROM USERS WHERE ID=@id;')
  return result.recordset[0]
}
exports.updateById = async(data)=>{
  const pool = await poolPromise;
  const {id,username,email,role} = data
  const result = await pool.request()
  .input('id',id)
  .input('username',username)
  .input('email',email)
  .input('role',role)
  .query('UPDATE USERS SET username=@username,email=@email,role=@role where id=@id;')
  return result.rowsAffected;
}
exports.getUserById = async (data) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', data.id)
    .query('SELECT u.* FROM Users u INNER JOIN Users p ON u.parent_id = p.parent_id WHERE u.id = @id;')
  return result.recordset[0];
}

exports.insertUser = async (user) => {
  const pool = await poolPromise;
  const { username, email, password,userrole,pid,tenantid } = user;
  const hashedPassword = await hashPassword(password);
  const result = await pool
    .request()
    .input('username',username)
    .input('email',email)
    .input('password',hashedPassword)
    .input('id', pid)
    .input('tenant_id',tenantid)
    .input('userrole', userrole? userrole : 'user')
    .query('INSERT INTO Users (username, email, password_hash,parent_id,role,tenant_id) VALUES (@username, @email, @password,@id,@userrole,@tenant_id);');
  return result.rowsAffected;
}
exports.addLogs = async (user) => {
  const pool = await poolPromise;
  const {pid,tenantid} = req;
  const { id, action, role} = req.body;

  const result = await pool
    .request()
    .input('id', id)
    .input('action', action)
    .input('role', role ?? 'user')         
    .input('userid', pid)
    .input('tenant_id', tenantid)
    .query(`
      INSERT INTO Logs (id, action, role, userid, tenant_id)
      VALUES (@id, @action, @role, @userid, @tenant_id);
    `);

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
    .query('SELECT password_hash,role,id,tenant_id FROM Users WHERE email = @email;');
  if (result.recordset.length === 0) {
    return false;
  }
  const check = comparePassword(password,result.recordset[0].password_hash);
  if (check){
    const token = generateToken(pid=result.recordset[0].id,role=result.recordset[0].role,tenantid=result.recordset[0].tenant_id);
    return token;
  }
  return false;
  
  
}
exports.downloadCSV = async (data) => {
   const json2csv = new Parser();
   const pool = await poolPromise;
   const idList = data.map(id => `'${id}'`).join(',');
const result = await pool.request().query(`
  SELECT u.id, u.username, u.email, w.username as CreatorName, u.created_at, v.name as Organisation 
  FROM Users u 
  JOIN tenants v ON u.tenant_id = v.id 
  JOIN Users w ON u.parent_id = w.id 
  WHERE u.id IN (${idList})
`);
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