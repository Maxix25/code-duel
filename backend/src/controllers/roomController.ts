import { Request, Response } from 'express';
import { getRandomQuestion } from '../models/Question';

export const startRoom = async (req: Request, res: Response): Promise<any> => {
    try {
        const question = await getRandomQuestion();
        if (!question) {
            return res.status(404).json({ error: 'No question found' });
        }
        res.status(200).json(question);
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
