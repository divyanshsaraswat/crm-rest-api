const express = require('express');
const router = express.Router();
const campController = require('../controllers/campController');
const { userAuth,adminAuth,fuseAuth } = require('../services/utilities/attachJWT');
router.get('/', userAuth,campController.getCampaigns);
router.post('/insert', userAuth,campController.insertCampaign);
router.delete('/:id', adminAuth,campController.deleteCampaign);
module.exports = router;