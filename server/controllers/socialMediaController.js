const socialMediaService = require('../services/socialMediaService');
const logger = require('../utils/logger');

const getSocialMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = await socialMediaService.getSocialMediaUpdates(id);
        
        const io = req.app.get('io');
        io.to(id).emit('social_media_updated', { disasterId: id, updates });
        
        res.json(updates);
    } catch (error) {
        logger.error('Failed to get social media updates', { error: error.message, params: req.params });
        res.status(500).json({ error: 'Failed to get social media updates' });
    }
};

module.exports = {
    getSocialMedia,
}; 