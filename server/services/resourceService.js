const { supabase } = require('../config/supabaseClient');
const geocodeService = require('./geocodeService');
const logger = require('../utils/logger');

const createResource = async (resourceData) => {
    const { name, location_name, type, disaster_id } = resourceData;

    const coordinates = await geocodeService.getCoordinates(location_name);
    let locationPoint = null;
    if (coordinates) {
        locationPoint = `POINT(${coordinates.longitude} ${coordinates.latitude})`;
    }

    const { data, error } = await supabase
        .from('resources')
        .insert([{
            name,
            location_name,
            type,
            disaster_id,
            location: locationPoint,
        }])
        .select()
        .single();
    
    if (error) {
        logger.error('Supabase error creating resource', { error });
        throw new Error(error.message);
    }
    return data;
};

const findNearbyResources = async (latitude, longitude, radius) => {
    const { data, error } = await supabase.rpc('find_resources_within_radius', {
        lat: latitude,
        long: longitude,
        radius: radius
    });

    if (error) {
        logger.error('Supabase error finding nearby resources', { error });
        throw new Error(error.message);
    }
    return data;
};

module.exports = {
    createResource,
    findNearbyResources,
}; 