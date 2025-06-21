const { supabase } = require('../config/supabaseClient');
const logger = require('../utils/logger');
const cache = require('./cacheService');

const mockSocialMediaApi = async (disasterId, keywords) => {
    // In a real scenario, you would use the Twitter/Bluesky API with the keywords.
    logger.info('Fetching from mock social media API', { disasterId, keywords });
    return new Promise(resolve => setTimeout(() => resolve([
        { post: `#${keywords[0]} Need food and water in downtown.`, user: 'citizen1', timestamp: new Date().toISOString() },
        { post: `Just saw a rescue team near the old bridge. #${keywords[0]}`, user: 'observer2', timestamp: new Date().toISOString() },
        { post: `Is there a shelter open? #help #${keywords[0]}`, user: 'familyInNeed', timestamp: new Date().toISOString() },
    ]), 500));
};

const getSocialMediaUpdates = async (disasterId) => {
    const cacheKey = `social_${disasterId}`;
    const cachedData = await cache.get(cacheKey);
    if (cachedData) return cachedData;

    const { data: disaster, error } = await supabase
        .from('disasters')
        .select('tags')
        .eq('id', disasterId)
        .single();

    if (error || !disaster) {
        logger.error('Failed to find disaster for social media updates', { disasterId, error });
        throw new Error('Disaster not found');
    }

    const socialMediaData = await mockSocialMediaApi(disasterId, disaster.tags);
    await cache.set(cacheKey, socialMediaData);

    return socialMediaData;
};

module.exports = { getSocialMediaUpdates }; 