const verificationService = require('../services/verificationService');
const logger = require('../utils/logger');
const { supabase } = require('../config/supabaseClient');

const verifyImage = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ error: 'Image URL is required' });
        }

        const result = await verificationService.verifyImage(imageUrl, reportId);

        // Fetch the disaster_id from the report to emit to the correct room
        const { data: report } = await supabase.from('reports').select('disaster_id').eq('id', reportId).single();

        if (report && report.disaster_id) {
            const io = req.app.get('io');
            io.to(report.disaster_id).emit('image_verified', { reportId, result });
        }

        res.json(result);
    } catch (error) {
        logger.error('Failed to verify image', { error: error.message, params: req.params });
        res.status(500).json({ error: 'Failed to verify image' });
    }
};

module.exports = {
    verifyImage,
}; 