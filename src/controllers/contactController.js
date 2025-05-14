const contactService = require('../services/contactService');


exports.getContacts = async (req, res) => {
  try {
    const users = await contactService.getContacts();
    res.status(200).json({ message: users });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.insertContact = async (req, res) => {
    try {
        const { first_name, last_name, email, phone,account_id } = req.body;
        const {pid,role} = req;
        
        if (!last_name) {
            return res.status(400).json({ error: 'Last name is required' });
        }

        const result = await contactService.insertContact({ 
            first_name, 
            last_name, 
            email, 
            phone, 
            account_id,
            pid 
        });
        
        res.status(201).json({ message: 'Contact inserted successfully'});
        } catch (error) {
        console.error('Error inserting contact:', error);
        res.status(500).json({ error: 'Internal Server Error outer' });
    }
}

exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await contactService.deleteContact(id);
    if (result) {
      res.status(200).json({ message: 'Contact deleted successfully' });
    } else {
      res.status(404).json({ error: 'Contact not found' });
    }
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


