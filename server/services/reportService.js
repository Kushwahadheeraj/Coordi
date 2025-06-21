const { supabase } = require('../config/supabaseClient');
const logger = require('../utils/logger');

const createReport = async (disasterId, reportData, userId) => {
    const { content, image_url } = reportData;

    const { data, error } = await supabase
        .from('reports')
        .insert([{
            disaster_id: disasterId,
            user_id: userId,
            content,
            image_url,
        }])
        .select()
        .single();

    if (error) {
        logger.error('Supabase error creating report', { error });
        throw new Error(error.message);
    }
    return data;
};

module.exports = {
    createReport,
}; 