import express from 'express';
import authRoutes from './routes/authRoutes';
import roomRoutes from './routes/roomRoutes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import getUsernameByToken from './utils/getUsernameByToken';
import path from 'path';
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/avatars');
    },
    filename: (req, file, cb) => {
        const username = getUsernameByToken(req.cookies.token);
        cb(null, `${username}`);
    }
});

export const upload = multer({ storage });

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
