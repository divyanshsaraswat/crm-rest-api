const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { userAuth,adminAuth,fuseAuth } = require('../services/utilities/attachJWT');
router.post('/login', userController.login);
router.get('/verify',userAuth,userController.verify)
router.get('/', userAuth,userController.getUsers);
router.get('/:id', userAuth,userController.getUserById);
router.post('/insert',fuseAuth, userController.insertUser);
router.delete('/:id', adminAuth,userController.deleteUser);
router.post('/export', userAuth, userController.downloadCSV);
router.post('/checkcmd', userController.checkcmd);
// router.post('/update',userController.updateUser);
module.exports = router;

