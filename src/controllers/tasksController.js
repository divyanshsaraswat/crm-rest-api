const tasksService = require('../services/tasksService');
exports.gettasks = async (req, res) => {
  try {
    const accounts = await tasksService.getTasks();
    res.status(200).json({ message: accounts });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
exports.getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const {role} = req;
        
        if (!id) {
            return res.status(400).json({ error: 'Task ID is required' });
        }

        const result = await tasksService.getTaskById(id);
        
        res.status(200).json({ message: result});
        } catch (error) {
        console.error('Error inserting task:', error);
        res.status(500).json({ error: 'Internal Server Error outer' });
    }
}


exports.insertTasks = async (req, res) => {
    try {
        const { subject, body, status, due_date, sender_email, contact_id } =req.body;
        const {pid,role} = req;
        
        if (!subject || !status) {
            return res.status(400).json({ error: 'Subject and status is required' });
        }

        const result = await tasksService.insertTask({ 
            subject,  
            body, 
            status,
            due_date,
            sender_email,
            contact_id,
            pid 
        });
        
        res.status(201).json({ message: 'Task inserted successfully'});
        } catch (error) {
        console.error('Error inserting account:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const {role} = req;
        
        if (!id) {
            return res.status(400).json({ error: 'Task ID is required' });
        }

        const result = await tasksService.deleteTask(id);
        
        res.status(200).json({ message: 'Task deleted successfully'});
        } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


// Example data object matching the schema
/* Example request body for creating a task:
{
    "subject": "Complete Project Report",
    "body": "Write and submit the quarterly project status report",
    "status": "pending",
    "due_date": "2024-01-15",
    "sender_email": "john.doe@example.com"
}
*/