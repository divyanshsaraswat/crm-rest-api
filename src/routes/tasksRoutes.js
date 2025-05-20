const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');
const { userAuth,adminAuth,fuseAuth } = require('../services/utilities/attachJWT');
router.get('/', userAuth,tasksController.gettasks);
router.post('/insert', userAuth,tasksController.insertTasks);
router.delete('/:id', adminAuth,tasksController.deleteTask);
module.exports = router;