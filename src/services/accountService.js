const { poolPromise } = require('../db/sqlConfig');
const {hashPassword,comparePassword} = require('../services/utilities/passwordhash');
const {generateToken} = require('../services/utilities/jwtsign');
const {Parser} = require('json2csv');

exports.getAccounts = async (data) => {
  const pool = await poolPromise;

  const {pid, role} = data;
  let query1 = `SELECT 
    a.id,
    a.name,
    a.industry,
    a.website,
    a.status,
    sm.srctype AS source_type,
    a.assigned_user_id,
    a.updated_at,
    a.CustomerName,
    a.Rating,
    a.ContPerson,
    a.Address1,
    a.Address2,
    a.City,
    a.Zip,
    a.State,
    a.Country,
    a.phone,
    a.waphone,
    a.email,
    a.JoiningDate,
    dm.degname AS designation_name,
    stm.statustype AS status_type,
    a.BusinessNature,
    fm.ftype AS followup_type
FROM accounts a
LEFT JOIN SOURCEMASTER sm ON a.SourceID = sm.id
LEFT JOIN DESIGNATIONMASTER dm ON a.DesignationID = dm.id
LEFT JOIN STATUSMASTER stm ON a.StatusID = stm.id
LEFT JOIN FOLLOWUPMASTER fm ON a.FollowupID = fm.id
ORDER BY a.updated_at DESC;`
  let result;
  if (role=="admin"){
     result = await pool.request().query(query1);
  }
  if (role=="user" || role=="manager"){
    result = await pool.request()
      .input('id', pid)
      .query('SELECT u.* FROM Accounts u INNER JOIN Accounts p ON u.assigned_user_id = p.assigned_user_id WHERE p.id = @id;')
  }
  return result.recordsets;
};

exports.getAccountsList = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT DISTINCT id, name FROM Accounts;');
  return result.recordset;
}
exports.getAccountById = async (id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', id)
    .query('SELECT u.* FROM Accounts u INNER JOIN Accounts p ON u.assigned_user_id = p.assigned_user_id WHERE u.id = @id;')
  return result.recordset[0];
}
exports.updateById = async(data)=>{
  const {id,first_name,last_name,email,phone,account_id} = data
  const pool = await poolPromise;
  const result = pool.request()
  .input('id',id)
  .input('first_name',first_name)
  .input('last_name',last_name)
  .input('email',email)
  .input('phone',phone)
  .input('account_id',account_id)
  .query(`UPDATE ACCOUNTS SET first_name=@first_name,last_name=@last_name,email=@email,phone=@phone,contact_owner_id=@account_id where id=@id;`)
  return result.rowsAffected;
}
exports.getidDetails = async()=>{
  const pool = await poolPromise;
  const query = `
WITH sm AS (
    SELECT ROW_NUMBER() OVER (ORDER BY id) AS rn, id AS srcid, srctype FROM SOURCEMASTER
),
dm AS (
    SELECT ROW_NUMBER() OVER (ORDER BY id) AS rn, id AS degid, degname FROM DESIGNATIONMASTER
),
st AS (
    SELECT ROW_NUMBER() OVER (ORDER BY id) AS rn, id AS statid, statustype FROM STATUSMASTER
)
SELECT 
    sm.srcid, sm.srctype,
    dm.degid, dm.degname,
    st.statid, st.statustype
FROM sm
FULL OUTER JOIN dm ON sm.rn = dm.rn
FULL OUTER JOIN st ON sm.rn = st.rn
ORDER BY COALESCE(sm.rn, dm.rn, st.rn);
`;
  const result = await pool.request().query(query);
  return result.recordsets;
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
  const {
      name,
      email,
      phone,
      waphone,
      BusinessNature,
      Address1,
      City,
      State,
      Country,
      Zip,
      SourceID,
      DesignationID,
      StatusID,
      pid
    } = account;

  const result = await pool
    .request()
    .input('name', name)
    .input('email', email?email:'')
    .input('phone', phone?phone:'')
    .input('waphone', waphone?waphone:'')
    .input('BusinessNature', BusinessNature?BusinessNature:'')
    .input('Address1', Address1?Address1:'')
    .input('City', City?City:'')
    .input('State', State?State:'')
    .input('Country', Country?Country:'')
    .input('Zip', Zip?Zip:'')
    .input('assigned_user_id', pid)
    .input('SourceID',SourceID?SourceID:'')
    .input('DesignationID',DesignationID?DesignationID:'')
    .input('StatusID',StatusID?StatusID:'')
    .query('INSERT INTO ACCOUNTS (NAME,EMAIL,PHONE,WAPHONE,BUSINESSNATURE,ADDRESS1,CITY,STATE,COUNTRY,ZIP,ASSIGNED_USER_ID,SOURCEID,DESIGNATIONID,STATUSID) VALUES (@NAME,@EMAIL,@PHONE,@WAPHONE,@BUSINESSNATURE,@ADDRESS1,@CITY,@STATE,@COUNTRY,@ZIP,@ASSIGNED_USER_ID,@SOURCEID,@DESIGNATIONID,@STATUSID)')
  return result.rowsAffected;
}
exports.downloadCSV = async (data) => {
   const json2csv = new Parser();
   const pool = await poolPromise;
   const idList = data.map(id => `'${id}'`).join(',');
   let query1 = `SELECT 
    a.id,
    a.name,
    a.industry,
    a.website,
    a.status,
    sm.srctype AS source_type,
    a.assigned_user_id,
    a.updated_at,
    a.CustomerName,
    a.Rating,
    a.ContPerson,
    a.Address1,
    a.Address2,
    a.City,
    a.Zip,
    a.State,
    a.Country,
    a.phone,
    a.waphone,
    a.email,
    a.JoiningDate,
    dm.degname AS designation_name,
    stm.statustype AS status_type,
    a.BusinessNature,
    fm.ftype AS followup_type
FROM accounts a
LEFT JOIN SOURCEMASTER sm ON a.SourceID = sm.id
LEFT JOIN DESIGNATIONMASTER dm ON a.DesignationID = dm.id
LEFT JOIN STATUSMASTER stm ON a.StatusID = stm.id
LEFT JOIN FOLLOWUPMASTER fm ON a.FollowupID = fm.id
WHERE A.ID IN (${idList})
ORDER BY a.updated_at DESC;`
   const result = await pool.request().query(query1);
  const csv = json2csv.parse(result.recordset);
  return csv;
  
}