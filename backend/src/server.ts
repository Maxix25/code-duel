import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { setIO } from './utils/sockets';
import app from './app';
import dotenv from 'dotenv';
import connectDB from './config/database';
import registerSocketHandlers from './sockets';

dotenv.config();

const PORT = process.env.PORT || 3000;

export let httpServer: http.Server;

const startServer = async () => {
    try {
        if (process.env.NODE_ENV !== 'test') {
            await connectDB();
        }
        httpServer = http.createServer(app);

        const io = new SocketIOServer(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        });

        io.on('connection', (socket) => {
            console.log('A user connected:', socket.id);
            registerSocketHandlers(io, socket);
            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
            });
        });

        // 4. Iniciar el servidor HTTP
        if (process.env.NODE_ENV !== 'test') {
            httpServer.listen(PORT, () => {
                console.log(`Server listening on http://localhost:${PORT}`);
            });
        }
    } catch (error) {
        console.error('Failed to start the server:', error);
        process.exit(1);
    }
};

startServer();
