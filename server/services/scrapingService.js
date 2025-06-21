const axios = require('axios');
const cheerio = require('cheerio');
const cache = require('./cacheService');
const logger = require('../utils/logger');

// A mock FEMA press releases page for scraping.
const FEMA_URL = 'https://www.fema.gov/press-release'; 

const getOfficialUpdates = async (disasterId) => {
    const cacheKey = `official_updates_${disasterId}`;
    const cachedData = await cache.get(cacheKey);
    if (cachedData) return cachedData;

    logger.info('Fetching official updates from external site', { url: FEMA_URL });

    try {
        const { data } = await axios.get(FEMA_URL);
        const $ = cheerio.load(data);
        const updates = [];
        
        // This selector is an example and will likely need to be updated
        // to match the actual structure of the target website.
        $('article.node--type-press-release').each((i, elem) => {
            if (updates.length >= 5) return; // Limit to 5 updates
            const title = $(elem).find('h2.node-title').text().trim();
            const link = 'https://www.fema.gov' + $(elem).find('a').attr('href');
            const summary = $(elem).find('.field--name-field-summary').text().trim();
            updates.push({ title, link, summary });
        });
        
        await cache.set(cacheKey, updates);
        return updates;

    } catch (error) {
        logger.error('Failed to scrape official updates', { error: error.message, url: FEMA_URL });
        throw new Error('Failed to scrape official updates.');
    }
};

module.exports = { getOfficialUpdates }; 