import { Request, Response } from 'express';
import Question, { getRandomQuestion } from '../models/Question';
import Room from '../models/Room';
import mongoose from 'mongoose';
import getUserIdByToken from '../utils/getUserIdByToken';
import Player from '../models/Player';
import getUsernameByToken from '../utils/getUsernameByToken';

export const startRoom = async (req: Request, res: Response): Promise<void> => {
    try {
        const user_token = req.cookies.token;
        let { password } = req.body;
        if (!password) {
            password = '';
        }
        if (!user_token) {
            res.status(401).json({ error: 'User token is required' });
            return;
        }
        const question = await getRandomQuestion();
        if (!question) {
            res.status(404).json({ error: 'No question found' });
            return;
        }
        // Check if user is already in a room
        const userId = getUserIdByToken(user_token);
        const username = getUsernameByToken(user_token);
        if (!userId) {
            res.status(401).json({ error: 'Invalid user token' });
            return;
        }
        const existingRoom = await Room.findOne({
            players: { $elemMatch: { player: userId } }
        });
        if (existingRoom) {
            console.log('User already in a room:', existingRoom.id);
            res.status(400).json({
                error: 'Already in a room',
                roomId: existingRoom.id
            });
            return;
        }
        // Create a new room
        const room = await Room.create({
            players: [
                {
                    player: userId,
                    score: 0,
                    current_code: question.startingCode
                }
            ],
            status: 'waiting',
            problemId: question._id,
            name: `${username}'s Room`,
            password
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
): Promise<void> => {
    try {
        const { roomId } = req.params;
        if (!mongoose.isValidObjectId(roomId)) {
            res.status(400).json({ error: 'Invalid room ID' });
            return;
        }
        const room = await Room.findById(roomId).populate('players.player');
        if (!room) {
            res.status(404).json({ error: 'Room not found' });
            return;
        }
        const results = room.players.map((p) => ({
            player:
                typeof p.player === 'object' && 'username' in p.player
                    ? p.player.username
                    : p.player.toString(),
            score: p.score
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
): Promise<void> => {
    try {
        const { roomId } = req.params;
        if (!mongoose.isValidObjectId(roomId)) {
            res.status(400).json({ error: 'Invalid room ID' });
            return;
        }
        const room = await Room.findById(roomId);
        if (!room) {
            res.status(404).json({ error: 'Room not found' });
            return;
        }
        if (room.status === 'waiting') {
            res.status(403).json({ error: 'Room is waiting for players' });
            return;
        }
        const question = await Question.findById(room.problemId);
        if (!question) {
            res.status(404).json({ error: 'Question not found' });
            return;
        }
        res.status(200).json({
            question: question.question,
            startingCode: question.startingCode
        });
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUsersInRoom = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { roomId } = req.params;
        if (!mongoose.isValidObjectId(roomId)) {
            res.status(400).json({ error: 'Invalid room ID' });
            return;
        }
        const room = await Room.findById(roomId).populate('players.player');
        if (!room) {
            res.status(404).json({ error: 'Room not found' });
            return;
        }
        const userIds = room.players.map((p) => p.player);
        // Turn ids into usernames if available
        const populatedUsers = await Player.find({
            _id: { $in: userIds }
        })
            .select('username')
            .lean();
        // Return only usernames
        res.status(200).json(
            populatedUsers.map((u) => u.username).filter(Boolean)
        );
    } catch (error) {
        console.error('Error fetching users in room:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllRooms = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const rooms = await Room.find({ status: 'waiting' })
            .populate('players.player', 'username')
            .select('id players status problemId name');
        const formattedRooms = rooms.map((room) => ({
            id: room.id,
            num_players: room.players.length,
            status: room.status,
            problemId: room.problemId,
            name: room.name
        }));
        res.status(200).json(formattedRooms);
    } catch (error) {
        console.error('Error fetching all rooms:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getCurrentCode = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { roomId } = req.params;
        if (!mongoose.isValidObjectId(roomId)) {
            res.status(400).json({ error: 'Invalid room ID' });
            return;
        }
        const room = await Room.findById(roomId);
        if (!room) {
            res.status(404).json({ error: 'Room not found' });
            return;
        }
        const userId = getUserIdByToken(req.cookies.token);
        if (!userId) {
            res.status(401).json({ error: 'Invalid user token' });
            return;
        }
        // Check if room is waiting for players
        if (room.status === 'waiting') {
            res.status(403).json({ error: 'Room is waiting for players' });
            return;
        }
        const player = room.players.find(
            (p) => p.player.toString() === userId.toString()
        );
        if (!player) {
            res.status(404).json({ error: 'User not found in room' });
            return;
        }
        res.status(200).json({ code: player.current_code });
    } catch (error) {
        console.error('Error fetching current code:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const userIsInRoom = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const token = req.cookies.token;
        const userId = getUserIdByToken(token);
        if (!userId) {
            res.status(401).json({ error: 'Invalid user token' });
            return;
        }
        const room = await Room.findOne({
            players: { $elemMatch: { player: userId } }
        });
        if (room) {
            res.status(200).json({ inRoom: true, roomId: room.id });
            return;
        } else {
            res.status(200).json({ inRoom: false });
            return;
        }
    } catch (error) {
        console.error('Error checking room status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const checkIfRoomHasPassword = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { roomId } = req.params;
        if (!mongoose.isValidObjectId(roomId)) {
            res.status(400).json({ error: 'Invalid room ID' });
            return;
        }
        const room = await Room.findById(roomId);
        if (!room) {
            res.status(404).json({ error: 'Room not found' });
            return;
        }
        if (room.password === '' || !room.password) {
            res.status(200).json({ hasPassword: false });
            return;
        }
        res.status(200).json({ hasPassword: true });
    } catch (error) {
        console.error('Error checking if room has password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const validateRoomPassword = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { roomId } = req.params;
        const { password } = req.body;
        if (!mongoose.isValidObjectId(roomId)) {
            res.status(400).json({ error: 'Invalid room ID' });
            return;
        }
        const room = await Room.findById(roomId);
        if (!room) {
            res.status(404).json({ error: 'Room not found' });
            return;
        }
        if (room.status === 'playing') {
            res.status(403).json({ error: 'Room is already running' });
            return;
        }
        // Password is correct, add user to room
        const userId = getUserIdByToken(req.cookies.token);
        if (!userId) {
            res.status(401).json({ error: 'Invalid user token' });
            return;
        }
        const isPasswordCorrect = await room.comparePassword(password);
        if (!isPasswordCorrect) {
            console.log('Invalid password for room:', roomId);
            res.status(403).json({ error: 'Invalid password' });
            return;
        }
        console.log('Password is correct, adding user to room');
        room.players.push({
            player: userId,
            score: 0,
            ready: false,
            current_code: ''
        });
        await room.save();
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error validating room password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
