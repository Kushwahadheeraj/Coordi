const { supabase } = require('../config/supabaseClient');
const geocodeService = require('./geocodeService');
const logger = require('../utils/logger');

const createDisaster = async (disasterData, ownerId) => {
    const { title, description, tags } = disasterData;

    // Geocode the location from the description
    const locationName = await geocodeService.extractLocationName(description);
    const coordinates = await geocodeService.getCoordinates(locationName);

    let locationPoint = null;
    if (coordinates) {
        locationPoint = `POINT(${coordinates.longitude} ${coordinates.latitude})`;
    }

    const { data, error } = await supabase
        .from('disasters')
        .insert([{
            title,
            description,
            tags,
            owner_id: ownerId,
            location_name: locationName,
            location: locationPoint,
        }])
        .select()
        .single();

    if (error) {
        logger.error('Supabase error creating disaster', { error });
        throw new Error(error.message);
    }
    return data;
};

const getDisasters = async (queryParams) => {
    const { tag } = queryParams;
    let query = supabase.from('disasters').select('*');

    if (tag) {
        query = query.contains('tags', [tag]);
    }

    const { data, error } = await query;
    if (error) {
        logger.error('Supabase error getting disasters', { error });
        throw new Error(error.message);
    }
    return data;
};

const updateDisaster = async (id, updateData, user) => {
    // First, verify ownership or admin role
    const { data: existingDisaster, error: fetchError } = await supabase
        .from('disasters')
        .select('owner_id')
        .eq('id', id)
        .single();

    if (fetchError || !existingDisaster) {
        logger.warn('Update failed: Disaster not found', { id });
        return null;
    }

    if (existingDisaster.owner_id !== user.id && user.role !== 'admin') {
        logger.warn('Update failed: User not authorized', { id, userId: user.id, role: user.role });
        return null;
    }
    
    // Ensure owner_id is passed for the audit trail trigger
    updateData.owner_id = user.id;

    const { data, error } = await supabase
        .from('disasters')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
    
    if (error) {
        logger.error('Supabase error updating disaster', { id, error });
        throw new Error(error.message);
    }
    return data;
};

const deleteDisaster = async (id, user) => {
    // Verify ownership or admin role before deleting
    const { data: existingDisaster, error: fetchError } = await supabase
        .from('disasters')
        .select('owner_id')
        .eq('id', id)
        .single();

    if (fetchError || !existingDisaster) {
        logger.warn('Delete failed: Disaster not found', { id });
        return null;
    }
    
    // Only owner or admin can delete
    if (existingDisaster.owner_id !== user.id && user.role !== 'admin') {
        logger.warn('Delete failed: User not authorized', { id, userId: user.id, role: user.role });
        return null;
    }

    const { data, error } = await supabase
        .from('disasters')
        .delete()
        .eq('id', id)
        .select()
        .single();

    if (error) {
        logger.error('Supabase error deleting disaster', { id, error });
        throw new Error(error.message);
    }
    return data;
};

module.exports = {
    createDisaster,
    getDisasters,
    updateDisaster,
    deleteDisaster,
}; 