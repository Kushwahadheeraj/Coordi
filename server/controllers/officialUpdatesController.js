const scrapingService = require('../services/scrapingService');
const logger = require('../utils/logger');

const getOfficialUpdates = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = await scrapingService.getOfficialUpdates(id);
        
        // Note: The prompt didn't specify a socket event for official updates,
        // but one could be added here if needed.
        // const io = req.app.get('io');
        // io.emit('official_updates_updated', { disasterId: id, updates });
        
        res.json(updates);
    } catch (error) {
        logger.error('Failed to get official updates', { error: error.message, params: req.params });
        res.status(500).json({ error: 'Failed to get official updates' });
    }
};

module.exports = {
    getOfficialUpdates,
}; 