const logger = require('../utils/logger');

const initializeSocket = (io) => {
    io.on('connection', (socket) => {
        logger.info('New client connected', { socketId: socket.id });

        // A client can join a room for a specific disaster
        socket.on('join_disaster_room', (disasterId) => {
            socket.join(disasterId);
            logger.info(`Socket ${socket.id} joined room ${disasterId}`);
            // Optionally, send a confirmation back to the client
            socket.emit('room_joined', { room: disasterId });
        });

        // A client can leave a room
        socket.on('leave_disaster_room', (disasterId) => {
            socket.leave(disasterId);
            logger.info(`Socket ${socket.id} left room ${disasterId}`);
        });

        socket.on('disconnect', () => {
            logger.info('Client disconnected', { socketId: socket.id });
        });
    });
};

module.exports = { initializeSocket }; 