const geocodeService = require('../services/geocodeService');
const logger = require('../utils/logger');

const geocode = async (req, res) => {
    const { description } = req.body;
    if (!description) {
        return res.status(400).json({ error: 'Description is required' });
    }

    try {
        const locationName = await geocodeService.extractLocationName(description);
        if (!locationName) {
            return res.status(404).json({ error: 'Could not extract a location from the description.' });
        }

        const coordinates = await geocodeService.getCoordinates(locationName);
        if (!coordinates) {
            return res.status(404).json({ error: 'Could not find coordinates for the extracted location.' });
        }

        logger.info('Geocoding successful', { description, locationName, coordinates });
        res.json({ locationName, ...coordinates });
    } catch (error) {
        logger.error('Geocoding process failed', { error: error.message, description });
        res.status(500).json({ error: 'An error occurred during the geocoding process.' });
    }
};

module.exports = {
    geocode,
}; 