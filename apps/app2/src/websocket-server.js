const WebSocket = require('ws');
const http = require('http');
const https = require('https');
const express = require('express');
const app = express();

const server = http.createServer(app);

const wss = new WebSocket.Server({
    server: server,
    path: '/app2/ws',
    clientTracking: true,
});

wss.on('connection', (ws, req) => {
    console.log('Client connected');
    console.log('Connection URL:', req.url);
    console.log('Headers:', req.headers);

    ws.send(JSON.stringify({
        type: 'connected',
        message: 'WebSocket connection established'
    }));

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Received:', data);
            
            ws.send(JSON.stringify({
                type: 'echo',
                data: data,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

app.use(express.static('public'));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`WebSocket endpoint: ws://localhost:${PORT}/app2/ws`);
});