const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase connection failed: Supabase URL and Anon Key must be provided in .env file.');
    throw new Error('Supabase URL and Anon Key must be provided.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const checkSupabaseConnection = async () => {
    try {
        // A simple query to check if the connection is valid.
        // We perform a lightweight query that should not fail if the connection is valid.
        const { error } = await supabase.from('disasters').select('id').limit(1);

        // If we get an error, but it's 'relation "..." does not exist' (42P01),
        // it means the connection is fine, but the table isn't there yet. This is expected on first run.
        if (error && error.code === '42P01') {
             console.log('Supabase connection successful, but a table was not found. Have you run the setup.sql script?');
        } else if (error) {
            console.error('Supabase connection failed:', error.message);
        } else {
            console.log('Supabase connection successful.');
        }
    } catch (e) {
        console.error('An unexpected error occurred during Supabase connection check:', e.message);
    }
};

module.exports = { supabase, checkSupabaseConnection }; 