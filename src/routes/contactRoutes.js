const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { userAuth,adminAuth,fuseAuth } = require('../services/utilities/attachJWT');
router.get('/', userAuth,contactController.getContacts);
router.get('/:id', userAuth,contactController.getContactById);
router.post('/insert', userAuth,contactController.insertContact);
router.get('/delete/:id', userAuth,contactController.deleteContact);

module.exports = router;