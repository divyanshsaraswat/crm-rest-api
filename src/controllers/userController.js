const userService = require('../services/userService');
exports.getUsers = async (req, res) => {
  try {
    const { pid,role,tenantid } = req;
    const users = await userService.getUsers({pid,role,tenantid});
    const log = await userService.addLogs({pid, tenantid, action: "Showed Users list", role});
    res.status(200).json({ message: users });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.sendMail = async(req,res)=>{
  try {
    const {pid} = req;
    const {title,body,sender} = req.body;
    const result = await userService.sendMail({title,body,sender});
    const log = await userService.addLogs({pid, action: "Sent email", role});

    if (result){
      res.status(200).json(result)
    }
  } catch (error) {
    res.status(500).json({"error":"Internal Server Error"})
    
  }
}

exports.changePassword = async(req,res)=>{
    try {
      const {pid} = req;
      const {password,oldpassword} = req.body
      console.log({password,oldpassword,pid});
      const result = await userService.forgotpassword({pid,oldpassword,password});
      const log = await userService.addLogs({pid, action: "Changed password", role});
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
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({message:"Internal Server Error"})
  }
}
exports.addLogs = async(req,res)=>{
  try {
    const {pid,tenantid} = req;
    const { action, role} = req.body;
    const result = await userService.addLogs({pid,tenantid,action,role});
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
    const log = await userService.addLogs({pid, action: "Updated settings", role});

    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({message:"Internal Server Error"})
  }
}
exports.getRoles = async(req,res)=>{
  try {
    const result = await userService.getRoles();
    const log = await userService.addLogs({pid, action: "Viewed roles list", role});
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
    const log = await userService.addLogs({pid, action: "Updated user details", role});
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
  const log = await userService.addLogs({pid, action: "Downloaded users CSV", role});

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
    const log = await userService.addLogs({pid, action: "Viewed user details", role});

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
    const log = await userService.addLogs({pid, action: "Created new user", role});
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
    const log = await userService.addLogs({pid, action: "Deleted user", role});
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
exports.getAllNotifications = async (req, res) => {
  try {
    const { pid } = req;
    const notifications = await userService.getAllByUserIdNotif(pid);
    res.status(200).json({ notifications});
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.createNotification = async (req, res) => {
  try {
    const {pid,tenantid} = req
    const { user_id, title, message, role} = req.body;
    const result = await userService.createNotif({ user_id, title, message,pid });
    await userService.addLogs({ pid,tenantid, action: "Created notification", role });
    res.status(201).json({ message: "Notification created successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.markAsRead = async (req, res) => {
  try {
    const { pid,tenantid,role } = req;
    const {id}  =req.params;
    const result = await userService.markAsReadNotif(id);
    await userService.addLogs({ pid,tenantid, action: "Marked notification as read", role });
    res.status(200).json({ message: "Notification marked as read." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.deleteNotification = async (req, res) => {
  try {
    const { pid,role,tenantid } = req;
    const {id} = req.params;
    await userService.deleteByIdNotif(id);
    await userService.addLogs({ pid,tenantid, action: "Deleted notification", role });
    res.status(200).json({ message: "Notification deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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