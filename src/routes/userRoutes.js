const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { userAuth,adminAuth,fuseAuth } = require('../services/utilities/attachJWT');
router.get('/notifications', userAuth, userController.getAllNotifications);
router.get('/settings',userAuth,userController.getSettings);
router.get('/verify',userAuth,userController.verify)
router.get('/details',userAuth,userController.getSignedDetails);
router.put('/settings',userAuth,userController.updateSettings);
router.get('/roles',userAuth,userController.getRoles);
router.get('/', userAuth,userController.getUsers);
router.put('/',fuseAuth,userController.updateById);
router.get('/:id', userAuth,userController.getUserById);
router.delete('/:id', adminAuth,userController.deleteUser);
router.patch('/notifications/:id/read', userAuth, userController.markAsRead);
router.delete('/notifications/:id', userAuth, userController.deleteNotification);
router.post('/notifications', userAuth, userController.createNotification);
router.post('/log',userAuth,userController.addLogs);
router.post('/login', userController.login);
router.post('/forgot',userAuth,userController.changePassword);
router.post('/insert',fuseAuth, userController.insertUser);
router.post('/export', userAuth, userController.downloadCSV);
router.post('/checkcmd', userController.checkcmd);
router.post('/mail',userAuth,userController.sendMail);
// router.post('/update',userController.updateUser);
module.exports = router;

