const express = require('express');
const router = express.Router();
const oppController = require('../controllers/oppController');
const { userAuth,adminAuth,fuseAuth } = require('../services/utilities/attachJWT');
router.get('/', userAuth,oppController.getOpps);
router.post('/insert', userAuth,oppController.insertOpps);
router.get('/delete/:id', adminAuth,oppController.deleteOpp);
module.exports = router;