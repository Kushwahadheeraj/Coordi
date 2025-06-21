const { supabase } = require('../config/supabaseClient');
const logger = require('../utils/logger');

const get = async (key) => {
    const { data, error } = await supabase
        .from('cache')
        .select('value, expires_at')
        .eq('key', key)
        .single();

    if (error && error.code !== 'PGRST116') { // Ignore 'not found' errors
        logger.error('Cache get error', { key, error: error.message });
        return null;
    }
    
    if (data) {
        if (new Date(data.expires_at) > new Date()) {
            logger.info('Cache hit', { key });
            return data.value;
        }
        logger.info('Cache expired', { key });
    } else {
        logger.info('Cache miss', { key });
    }
    
    return null;
};

const set = async (key, value, ttlSeconds = 3600) => { // Default TTL: 1 hour
    const expires_at = new Date(Date.now() + ttlSeconds * 1000);
    const { error } = await supabase
        .from('cache')
        .upsert({ key, value, expires_at }, { onConflict: 'key' });

    if (error) {
        logger.error('Cache set error', { key, error: error.message });
    } else {
        logger.info('Cache set', { key, ttlSeconds });
    }
};

module.exports = {
    get,
    set,
}; 