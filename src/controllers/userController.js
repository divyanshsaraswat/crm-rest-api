const userService = require('../services/userService');
exports.getUsers = async (req, res) => {
  try {
    const { pid,role,tenantid } = req;
    const users = await userService.getUsers({pid,role,tenantid});
    res.status(200).json({ message: users });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.changePassword = async(req,res)=>{
    try {
      const {pid} = req;
      const {password,oldpassword} = req.body
      console.log({password,oldpassword,pid});
      const result = await userService.forgotpassword({pid,oldpassword,password});
      console.log(result)
      // const result = false
      if (result){

        res.status(200).json(result)
      }
      if (!result){
        res.status(403).json({"message":"Password do not match!"});
      }
  } catch (error) {
    res.status(500).json({message:"Internal Server Error"})
  }

}
exports.getSettings = async(req,res)=>{
  try {
    const {pid} = req;
    const result = await userService.getSettings({pid});
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({message:"Internal Server Error"})
  }
}
exports.addLogs = async(req,res)=>{
  try {
    const {pid} = req;
    const {} = req.body;
    const result = await userService.addLogs({pid});
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({message:"Internal Server Error"})
  }
  
}
exports.getSignedDetails = async(req,res)=>{
  try {
    const {pid} = req;
    const result = await userService.getSignedDetails({pid});
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({message:"Internal Server Error"})
  }
}
exports.updateSettings = async(req,res)=>{
  try {
    const {pid} = req;
const {
  notify_email,
  notify_browser,
  notify_lead_alerts,
  notify_task_reminders,
  date_format,
  time_format,
  currency,
  theme,

} = req.body;    
console.log({
  notify_email,
  notify_browser,
  notify_lead_alerts,
  notify_task_reminders,
  date_format,
  time_format,
  currency,
  theme,
})
const result = await userService.updateSettings({pid,notify_email,
  notify_browser,
  notify_lead_alerts,
  notify_task_reminders,
  date_format,
  time_format,
  currency,
  theme});
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({message:"Internal Server Error"})
  }
}
exports.getRoles = async(req,res)=>{
  try {
    const result = await userService.getRoles();
    res.status(200).json({'message':result})
  } catch (error) {
    res.status(500).json({error:'Internal Server Error'})
  }
};
exports.verify = async (req,res)=>{
  try{
    const {pid} = req;
    const data = await userService.getDetails(pid);
    res.status(200).json(data);
  }catch(error){
    res.status(500).json({error:'Internal Server Error'})
  }
}
exports.updateById = async(req,res)=>{
  try {
    const {id,username,email,role} = req.body
    const result = await userService.updateById({id,username,email,role})
    res.status(200).json({message:"Updated Successfully."})
  } catch (error) {
    res.status(500).json({error:"Internal Server Error"})
  }
}
exports.downloadCSV = async (req, res) => {
  try {
  const{ records} = req.body;

  // console.log(records);
  
  const result = await userService.downloadCSV(records);
  res.status(200)
    .set({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="users.csv"'
    })
    .send(result);
  }
  catch (error) {
    console.error('Error downloading CSV:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
exports.getUserById = async (req, res) => {
  try {
    const { id,role } = req.params;
    if (!id) {  
      return res.status(400).json({ error: 'User ID is required' });
    }
    const user = await userService.getUserById({id});
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
exports.insertUser = async (req, res) => {
  try {
    const { username, email, password,userrole } = req.body;
    const { pid, role,tenantid } = req;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (role=='user'){
      return res.status(400).json({ error: 'You are not authorized to create a user' });
    }
    const result = await userService.insertUser({ username, email, password,userrole,pid,tenantid });
    res.status(201).json({ message: 'User inserted successfully',role:role, id: pid });
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ error: 'Internal Server Error outer' });
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const {id} = req.params;
    const { pid,role } = req;
    console.log(req.params)
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    if (role=='user'){
      return res.status(400).json({ error: 'You are not authorized to delete a user' });
    }
    const result = await userService.deleteUser(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
exports.checkcmd = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    const result = await userService.checkcmd(query);
    res.status(200).json({ message: result });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
exports.login = async (req, res) => {
  try {
    const { email,password } = req.body;
    if (!email ) {
      return res.status(400).json({ error: 'Username is required' });
    }
    if (!password ) {
      return res.status(400).json({ error: 'Password is required' });
    }
   
    const result = await userService.login(email,password);
    
    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.cookie('token', result, {
      httpOnly: true,
      secure: 'production',
      sameSite: 'lax', 
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(200).json({ message: "Login Successful." });
  } catch (error) {
    console.error('Error checking password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// exports.updateUser = async (req, res) => {
//   try {
//     const { id, username, email, password } = req.body;
//     if (!id || !username || !email || !password) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }
//     const existingUser = await userService.getUserById(id);
//     if (!existingUser) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     const result = await userService.updateUser({ id, username, email, password });
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     res.status(200).json({ message: 'User updated successfully' });
//   } catch (error) {
//     console.error('Error updating user:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }


// Example request body for Postman:
/*
{
  "username": "john_doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "userrole": "user"
}
*/