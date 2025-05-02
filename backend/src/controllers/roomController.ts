import { Request, Response } from 'express';
import Question, { getRandomQuestion } from '../models/Question';
import Room from '../models/Room';
import { ObjectId } from 'mongoose';

export const startRoom = async (req: Request, res: Response): Promise<any> => {
    try {
        const question = await getRandomQuestion();
        if (!question) {
            return res.status(404).json({ error: 'No question found' });
        }
        const room = await Room.create({
            players: [],
            status: 'waiting',
            problemId: question._id,
        });
        res.status(200).json({ roomId: room.id });
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getRoomQuestion = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const { roomId } = req.params;
        console.log('Room ID:', roomId);
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        const question = await Question.findById(room.problemId);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.status(200).json({
            question: question.question,
            startingCode: question.startingCode,
        });
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
