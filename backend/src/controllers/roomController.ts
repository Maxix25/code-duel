import { Request, Response } from 'express';
import Question, { getRandomQuestion } from '../models/Question';
import Room from '../models/Room';
import mongoose from 'mongoose';
import getUserIdByToken from '../utils/getUserIdByToken';
import Player from '../models/Player';

export const startRoom = async (req: Request, res: Response): Promise<any> => {
    try {
        const user_token = req.body.user_token;
        if (!user_token) {
            return res.status(401).json({ error: 'User token is required' });
        }
        const question = await getRandomQuestion();
        if (!question) {
            return res.status(404).json({ error: 'No question found' });
        }
        // Check if user is already in a room
        const userId = getUserIdByToken(user_token);
        if (!userId) {
            return res.status(401).json({ error: 'Invalid user token' });
        }
        const existingRoom = await Room.findOne({
            players: { $elemMatch: { player: userId } },
        });
        if (existingRoom) {
            console.log('User already in a room:', existingRoom.id);
            return res
                .status(400)
                .json({ error: 'Already in a room', roomId: existingRoom.id });
        }
        // Create a new room
        const room = await Room.create({
            players: [{ player: userId, score: 0 }],
            status: 'waiting',
            problemId: question._id,
        });
        res.status(200).json({ roomId: room.id });
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getRoomResults = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const { roomId } = req.params;
        if (!mongoose.isValidObjectId(roomId)) {
            return res.status(400).json({ error: 'Invalid room ID' });
        }
        const room = await Room.findById(roomId).populate('players.player');
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        const results = room.players.map((p) => ({
            player:
                typeof p.player === 'object' && 'username' in p.player
                    ? p.player.username
                    : p.player.toString(),
            score: p.score,
        }));
        console.log('Room results:', results);
        res.status(200).json({ results });
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getRoomQuestion = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const { roomId } = req.params;
        if (!mongoose.isValidObjectId(roomId)) {
            return res.status(400).json({ error: 'Invalid room ID' });
        }
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

export const getUsersInRoom = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {
        const { roomId } = req.params;
        if (!mongoose.isValidObjectId(roomId)) {
            return res.status(400).json({ error: 'Invalid room ID' });
        }
        const room = await Room.findById(roomId).populate('players.player');
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        // Extract player IDs directly
        const userIds = room.players.map((p) => p.player);
        // Turn ids into usernames if available
        const populatedUsers = await Player.find({
            _id: { $in: userIds },
        })
            .select('username')
            .lean();
        // Return only usernames
        res.status(200).json(populatedUsers.map((u) => u.username).filter(Boolean));
    } catch (error) {
        console.error('Error fetching users in room:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
