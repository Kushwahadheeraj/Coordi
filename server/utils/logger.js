const { supabase } = require('../config/supabaseClient');

const log = async (level, message, meta = {}) => {
    try {
        const { error } = await supabase.from('logs').insert([{
            level,
            message,
            meta
        }]);
        if (error) {
            console.error('Failed to write to logs table:', error.message);
        }
    } catch (err) {
        console.error('Error in logger:', err.message);
    }
    // Also log to console
    console.log(`[${level.toUpperCase()}] ${message}`, meta);
};

module.exports = {
    info: (message, meta) => log('INFO', message, meta),
    warn: (message, meta) => log('WARN', message, meta),
    error: (message, meta) => log('ERROR', message, meta),
}; 