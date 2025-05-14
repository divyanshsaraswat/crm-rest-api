const express = require('express');
const router = express.Router();
const oppController = require('../controllers/oppController');
const { userAuth,adminAuth,fuseAuth } = require('../services/utilities/attachJWT');
router.get('/', userAuth,oppController.gettasks);
router.post('/insert', userAuth,oppController.insertTasks);
router.get('/delete/:id', adminAuth,oppController.deleteTask);
module.exports = router;