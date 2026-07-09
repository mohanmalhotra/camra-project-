const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    console.log('Ek naya user connect hua h: ' + socket.id);

    socket.on('video-frame', (data) => {
        socket.broadcast.emit('stream-receive', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnect ho gya: ' + socket.id);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running smoothly on: http://localhost:${PORT}`);
});