const express = require('express');
const geocodeController = require('../controllers/geocodeController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, geocodeController.geocode);

module.exports = router; 