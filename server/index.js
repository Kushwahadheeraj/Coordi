require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const allRoutes = require('./routes');
const { initializeSocket } = require('./sockets/socketManager');
const { checkSupabaseConnection } = require('./config/supabaseClient');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for simplicity. Should be restricted in production.
        methods: ["GET", "POST"]
    }
});

app.use(express.json());

// Make io accessible to our router
app.set('io', io);

// Check DB connection on startup
checkSupabaseConnection();

// Initialize socket events
initializeSocket(io);

// Use the main router
app.use('/api', allRoutes);

app.get('/', (req, res) => {
  res.send('<h1>Disaster Response Platform API</h1>');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, server, io };
