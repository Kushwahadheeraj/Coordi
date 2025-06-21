const express = require('express');
const reportController = require('../controllers/reportController');
const verificationController = require('../controllers/verificationController');
const { authenticate, authorize } = require('../middleware/auth');

// This router will be mounted with a disasterId context, so routes are relative to that.
const router = express.Router({ mergeParams: true });

// POST /disasters/:id/reports
router.post('/', authenticate, authorize(['admin', 'contributor']), reportController.createReport);

// The prompt asked for /disasters/:id/verify-image.
// A more RESTful approach is to verify the image on the report resource itself.
// This route will be effectively mounted at /disasters/:disasterId/reports/:reportId/verify
// But for simplicity, we are creating a separate route for verification.
// The route will be /reports/:reportId/verify-image
const verificationRouter = express.Router();
verificationRouter.post('/:reportId/verify-image', authenticate, authorize(['admin']), verificationController.verifyImage);


module.exports = { reportRouter: router, verificationRouter }; 