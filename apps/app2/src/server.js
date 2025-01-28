const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

const wss = new WebSocket.Server({
    server,
    path: '/app2/ws',
    clientTracking: true
});

// Debug logs for all incoming requests
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    next();
});

app.use(express.static(path.join(__dirname, '../public')));

app.get(['/', '/app2'], (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

const clients = new Map();

wss.on('connection', (ws, req) => {
    const connectionStart = Date.now();
    clients.set(ws, { connectionStart });

    console.log('Client connected, URL:', req.url);
    console.log('Protocol:', req.headers['sec-websocket-protocol'] || 'none');
    console.log('SSL/TLS at Node level:', req.socket.encrypted ? 'Yes' : 'No');
    console.log('New WebSocket connection from:', req.socket.remoteAddress);
    console.log('Connection URL:', req.url);
    console.log('Headers:', req.headers);

    ws.send(JSON.stringify({
        type: 'connected',
        message: 'WebSocket connection established',
        path: '/app2/ws'
    }));
    

    const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            const pingStart = Date.now();
            ws.send(JSON.stringify({
                type: 'ping',
                timestamp: pingStart
            }));
        }
    }, 1000);

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'pong') {
                const latency = Date.now() - data.timestamp;
                const uptime = Date.now() - connectionStart;
                ws.send(JSON.stringify({
                    type: 'status',
                    latency,
                    uptime,
                    timestamp: Date.now()
                }));
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.on('close', () => {
        clearInterval(pingInterval);
        clients.delete(ws);
        console.log('Client disconnected');
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`App2 (HTTP) server listening on port ${PORT}`);
    console.log(`WebSocket server path: "/app2/ws" on port ${PORT}`);
});
