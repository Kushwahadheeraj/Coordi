const express = require('express');
const disasterController = require('../controllers/disasterController');
const socialMediaController = require('../controllers/socialMediaController');
const officialUpdatesController = require('../controllers/officialUpdatesController');
const { reportRouter } = require('./reports');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Helper: Add audit trail entry
function addAuditTrail(existing, action, userId) {
  const trail = existing?.audit_trail || [];
  trail.push({ action, user_id: userId, timestamp: new Date().toISOString() });
  return trail;
}

// Create disaster
router.post('/', authenticate, authorize(['admin', 'contributor']), disasterController.createDisaster);

// Get disasters (optionally filter by tag)
router.get('/', disasterController.getDisasters);

// Update disaster
router.put('/:id', authenticate, authorize(['admin', 'contributor']), disasterController.updateDisaster);

// Delete disaster
router.delete('/:id', authenticate, authorize('admin'), disasterController.deleteDisaster);

// Social Media Route
router.get('/:id/social-media', authenticate, socialMediaController.getSocialMedia);

// Official Updates Route
router.get('/:id/official-updates', authenticate, officialUpdatesController.getOfficialUpdates);

// Mount the reports router
router.use('/:id/reports', reportRouter);

module.exports = router; 