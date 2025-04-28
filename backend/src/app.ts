import express from 'express';
import authRoutes from './routes/authRoutes';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/auth', authRoutes);

export default app;
