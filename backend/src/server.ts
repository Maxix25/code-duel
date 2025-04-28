import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import dotenv from 'dotenv';
import connectDB from './config/database';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();

        const httpServer = http.createServer(app);

        const io = new SocketIOServer(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        });

        io.on('connection', (socket) => {
            console.log('A user connected:', socket.id);
            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
            });
            socket.on('message', (message) => {
                console.log('Message received:', message);
            });
        });

        // 4. Iniciar el servidor HTTP
        httpServer.listen(PORT, () => {
            console.log(`Server listening on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error);
        process.exit(1);
    }
};

startServer();
