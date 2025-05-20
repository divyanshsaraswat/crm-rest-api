const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { userAuth,adminAuth,fuseAuth } = require('../services/utilities/attachJWT');
router.get('/', userAuth,contactController.getContacts);
router.get('/:id', userAuth,contactController.getContactById);
router.post('/insert', userAuth,contactController.insertContact);
router.delete('/:id', userAuth,contactController.deleteContact);
router.post('/export', userAuth, contactController.downloadCSV);

module.exports = router;