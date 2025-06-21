const disasterService = require('../services/disasterService');
const logger = require('../utils/logger');

const createDisaster = async (req, res) => {
    try {
        const disaster = await disasterService.createDisaster(req.body, req.user.id);
        const io = req.app.get('io');
        io.emit('disaster_updated', { action: 'create', disaster });
        logger.info('Disaster created successfully', { disasterId: disaster.id, owner: req.user.id });
        res.status(201).json(disaster);
    } catch (error) {
        logger.error('Failed to create disaster', { error: error.message, body: req.body });
        res.status(500).json({ error: 'Failed to create disaster' });
    }
};

const getDisasters = async (req, res) => {
    try {
        const disasters = await disasterService.getDisasters(req.query);
        res.json(disasters);
    } catch (error) {
        logger.error('Failed to get disasters', { error: error.message, query: req.query });
        res.status(500).json({ error: 'Failed to get disasters' });
    }
};

const updateDisaster = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedDisaster = await disasterService.updateDisaster(id, req.body, req.user);

        if (!updatedDisaster) {
            return res.status(404).json({ error: 'Disaster not found or user not authorized' });
        }
        
        const io = req.app.get('io');
        io.to(id).emit('disaster_updated', { action: 'update', disaster: updatedDisaster });
        logger.info('Disaster updated successfully', { disasterId: id, user: req.user.id });
        res.json(updatedDisaster);
    } catch (error) {
        logger.error('Failed to update disaster', { error: error.message, params: req.params });
        res.status(500).json({ error: 'Failed to update disaster' });
    }
};

const deleteDisaster = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDisaster = await disasterService.deleteDisaster(id, req.user);

        if (!deletedDisaster) {
            return res.status(404).json({ error: 'Disaster not found or user not authorized' });
        }

        const io = req.app.get('io');
        io.to(id).emit('disaster_updated', { action: 'delete', disasterId: id });
        logger.info('Disaster deleted successfully', { disasterId: id, user: req.user.id });
        res.status(204).send();
    } catch (error) {
        logger.error('Failed to delete disaster', { error: error.message, params: req.params });
        res.status(500).json({ error: 'Failed to delete disaster' });
    }
};

module.exports = {
    createDisaster,
    getDisasters,
    updateDisaster,
    deleteDisaster,
}; 