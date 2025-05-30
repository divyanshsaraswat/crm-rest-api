const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { userAuth,adminAuth,fuseAuth } = require('../services/utilities/attachJWT');
router.get('/verify',userAuth,userController.verify)
router.get('/roles',userAuth,userController.getRoles);
router.get('/', userAuth,userController.getUsers);
router.put('/',fuseAuth,userController.updateById)
router.get('/:id', userAuth,userController.getUserById);
router.delete('/:id', adminAuth,userController.deleteUser);
router.post('/login', userController.login);
router.post('/insert',fuseAuth, userController.insertUser);
router.post('/export', userAuth, userController.downloadCSV);
router.post('/checkcmd', userController.checkcmd);
// router.post('/update',userController.updateUser);
module.exports = router;

