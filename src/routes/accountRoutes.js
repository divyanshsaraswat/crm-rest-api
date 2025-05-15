const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { userAuth,adminAuth,fuseAuth } = require('../services/utilities/attachJWT');
router.get('/', userAuth,accountController.getAccounts);
router.get('/:id', userAuth,accountController.getAccountById);
router.post('/insert', userAuth,accountController.insertAccount);
router.get('/delete/:id', adminAuth,accountController.deleteAccount);
module.exports = router;