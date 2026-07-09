const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Socket.io setup with CORS permissions
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Static files load karne ke liye (HTML, JS, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Jab koi client connect ho
io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);

    // 📲 Phone se aane wale frames ko catch karna
    socket.on('video-frame', (frameData) => {
        // 💻 Yeh frames baaki sabhi devices (Laptop) ko bhej dena
        socket.broadcast.emit('stream-frame', frameData);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });
});

// Port configuration for Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running smoothly on port ${PORT}`);
});