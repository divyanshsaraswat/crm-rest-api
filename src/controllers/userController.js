const userService = require('../services/userService');

exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json({ message: users });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const user = await userService.getUserById(id);
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
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const result = await userService.insertUser({ username, email, password });
    res.status(201).json({ message: 'User inserted successfully'});
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ error: 'Internal Server Error outer' });
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
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