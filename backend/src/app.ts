import express from 'express';
import authRoutes from './routes/authRoutes';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/auth', authRoutes);

export default app;
