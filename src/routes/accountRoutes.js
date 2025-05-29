const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { userAuth,adminAuth,fuseAuth } = require('../services/utilities/attachJWT');
router.get('/', userAuth,accountController.getAccounts);
router.get('/list',userAuth,accountController.getAccountLists);
router.get('/:id', userAuth,accountController.getAccountById);
router.put('/',fuseAuth,accountController.updateById)
router.get('/idDetails',userAuth,accountController.getidDetails);
router.post('/insert', userAuth,accountController.insertAccount);
router.delete('/:id', adminAuth,accountController.deleteAccount);
router.post('/export', userAuth, accountController.downloadCSV);

module.exports = router;