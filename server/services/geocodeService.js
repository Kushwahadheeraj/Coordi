const { GoogleGenerativeAI } = require("@google/generative-ai");
const NodeGeocoder = require('node-geocoder');
const logger = require('../utils/logger');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const geocoderOptions = {
    provider: 'openstreetmap',
};
const geocoder = NodeGeocoder(geocoderOptions);

async function extractLocationName(description) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Extract the location name (e.g., city, state, country, or a well-known landmark) from the following text. Respond with only the location name and nothing else. If no location is found, respond with "null".\n\nText: "${description}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const locationName = await response.text();
        
        if (locationName.toLowerCase().trim() === 'null') {
            logger.warn('No location found in description', { description });
            return null;
        }
        
        logger.info('Extracted location from description', { locationName });
        return locationName.trim();
    } catch (error) {
        logger.error('Error with Gemini API for location extraction', { error: error.message });
        throw new Error('Failed to extract location using Gemini API.');
    }
}

async function getCoordinates(locationName) {
    if (!locationName) return null;
    try {
        const res = await geocoder.geocode(locationName);
        if (res.length > 0) {
            const { latitude, longitude } = res[0];
            logger.info('Geocoded location name successfully', { locationName, coordinates: { latitude, longitude } });
            return { latitude, longitude };
        }
        logger.warn('Could not geocode location name', { locationName });
        return null;
    } catch (error) {
        logger.error('Error with geocoding service', { locationName, error: error.message });
        throw new Error('Failed to geocode location name.');
    }
}

module.exports = {
    extractLocationName,
    getCoordinates,
}; 