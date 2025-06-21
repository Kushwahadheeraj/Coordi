const reportService = require('../services/reportService');
const logger = require('../utils/logger');

const createReport = async (req, res) => {
    try {
        const report = await reportService.createReport(req.params.id, req.body, req.user.id);
        // Emitting an event for a new report to the specific disaster room
        const io = req.app.get('io');
        io.to(req.params.id).emit('report_created', { disasterId: req.params.id, report });
        logger.info('Report created successfully', { reportId: report.id });
        res.status(201).json(report);
    } catch (error) {
        logger.error('Failed to create report', { error: error.message, body: req.body });
        res.status(500).json({ error: 'Failed to create report' });
    }
};

module.exports = {
    createReport,
}; 