import { Request, Response } from 'express';
import Player from '../models/Player';
import { generateToken } from '../utils/jwtHelper';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/jwtHelper';
const { Types } = mongoose;

export const loginPlayer = async (
    req: Request,
    res: Response
): Promise<any> => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const player = await Player.findOne({ username });

        if (!player) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await player.comparePassword(password);

        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(
            player._id as mongoose.Types.ObjectId,
            username
        );

        res.status(200).json({
            message: 'Login successful',
            token: token,
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error during login' });
    }
};

export const registerPlayer = async (
    req: Request,
    res: Response
): Promise<any> => {
    const { username, password, email } = req.body;

    if (!username || !password) {
        res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const existingPlayer = await Player.findOne({ username, email });

        if (existingPlayer) {
            return res
                .status(409)
                .json({ message: 'Username or email already registered' });
        }

        const newPlayer = new Player({
            username,
            password,
            email,
        });

        await newPlayer.save();

        const token = generateToken(
            newPlayer._id as mongoose.Types.ObjectId,
            username
        );

        res.status(201).json({
            message: 'Registration successful',
            token: token,
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res
            .status(500)
            .json({ message: 'Server error during registration' });
    }
};

export const verifyAuth = async (req: Request, res: Response): Promise<any> => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.status(200).json({ message: 'Token is valid', decoded });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
