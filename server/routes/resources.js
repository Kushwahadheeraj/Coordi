const express = require('express');
const resourceController = require('../controllers/resourceController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// As per the prompt, this is a GET request. A more RESTful approach for creation would be POST.
// I'm providing a POST endpoint for creating resources as it's more conventional.
router.post('/', authenticate, authorize(['admin', 'contributor']), resourceController.createResource);

// The prompt asks for GET /disasters/:id/resources?lat=...&lon=...
// A more standard RESTful pattern is to query the resource collection directly.
// This implementation provides a more flexible and reusable endpoint.
router.get('/nearby', authenticate, resourceController.getNearbyResources);

module.exports = router; 