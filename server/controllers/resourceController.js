const resourceService = require('../services/resourceService');
const logger = require('../utils/logger');

const createResource = async (req, res) => {
    try {
        const resource = await resourceService.createResource(req.body);
        const io = req.app.get('io');
        // Broadcast to a room based on the disaster
        if (resource.disaster_id) {
            io.to(resource.disaster_id).emit('resources_updated', { action: 'create', resource });
        }
        logger.info('Resource created successfully', { resourceId: resource.id });
        res.status(201).json(resource);
    } catch (error) {
        logger.error('Failed to create resource', { error: error.message, body: req.body });
        res.status(500).json({ error: 'Failed to create resource' });
    }
};

const getNearbyResources = async (req, res) => {
    try {
        const { lat, lon, radius } = req.query; // radius in meters
        if (!lat || !lon) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }
        
        const resources = await resourceService.findNearbyResources(parseFloat(lat), parseFloat(lon), parseInt(radius, 10) || 10000);
        res.json(resources);
    } catch (error) {
        logger.error('Failed to get nearby resources', { error: error.message, query: req.query });
        res.status(500).json({ error: 'Failed to get nearby resources' });
    }
};

module.exports = {
    createResource,
    getNearbyResources,
}; 