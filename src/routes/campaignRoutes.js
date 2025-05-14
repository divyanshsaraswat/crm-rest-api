const express = require('express');
const router = express.Router();
const campController = require('../controllers/campController');
const { userAuth,adminAuth,fuseAuth } = require('../services/utilities/attachJWT');
router.get('/', userAuth,campController.gettasks);
router.post('/insert', userAuth,campController.insertTasks);
router.get('/delete/:id', adminAuth,campController.deleteTask);
module.exports = router;