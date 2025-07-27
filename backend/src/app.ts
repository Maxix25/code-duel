import express from 'express';
import authRoutes from './routes/authRoutes';
import roomRoutes from './routes/roomRoutes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    })
);

app.use('/auth', authRoutes);
app.use('/room', roomRoutes);

export default app;
