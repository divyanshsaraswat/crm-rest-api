const express = require('express');
const router = express.Router();
const leadsController = require('../controllers/leadsController');
const { userAuth,adminAuth,fuseAuth } = require('../services/utilities/attachJWT');
router.get('/', userAuth,leadsController.getLeads);
router.post('/insert', userAuth,leadsController.insertLead);
router.get('/delete/:id', adminAuth,leadsController.deleteLead);
module.exports = router;