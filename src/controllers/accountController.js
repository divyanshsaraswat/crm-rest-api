const accountService = require('../services/accountService');
exports.getAccounts = async (req, res) => {
  try {
    const { pid, role } = req;
    const data = { pid, role };
    const accounts = await accountService.getAccounts(data);
    res.status(200).json({ message: accounts });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
exports.getAccountById = async (req, res) => {
    try {
        const { id } = req.params;
        const {role} = req;
        if (!id) {
            return res.status(400).json({ error: 'Account ID is required' });
        }
        const account = await accountService.getAccountById(id);
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }
        res.status(200).json({ message: account });
    } catch (error) {
        console.error('Error fetching account:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.insertAccount = async (req, res) => {
    try {
        const { account_name, industry,website,source,status} = req.body;
        const {pid,role} = req;
        
        if (!account_name) {
            return res.status(400).json({ error: 'Account name is required' });
        }

        const result = await accountService.insertAccount({ 
            account_name,  
            industry, 
            website,
            source,
            status, 
            pid 
        });
        
        res.status(201).json({ message: 'Account inserted successfully'});
        } catch (error) {
        console.error('Error inserting account:', error);
        res.status(500).json({ error: 'Internal Server Error outer' });
    }
}

exports.deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const {role} = req;
        
        if (!id) {
            return res.status(400).json({ error: 'Account ID is required' });
        }

        const result = await accountService.deleteAccount(id);
        
        res.status(200).json({ message: 'Account deleted successfully'});
        } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ error: 'Internal Server Error outer' });
    }
}


// Example data object matching the schema
