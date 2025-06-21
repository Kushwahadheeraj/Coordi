const express = require('express');
const disasterRouter = require('./disasters');
const geocodeRouter = require('./geocode');
const resourceRouter = require('./resources');
const { verificationRouter } = require('./reports');

const router = express.Router();

router.use('/disasters', disasterRouter);
router.use('/geocode', geocodeRouter);
router.use('/resources', resourceRouter);
router.use('/reports', verificationRouter);

module.exports = router; 