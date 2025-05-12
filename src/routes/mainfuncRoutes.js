const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainfunccontroller');

router.get('/', mainController.mainfunc);

module.exports = router;