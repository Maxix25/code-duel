import { Request, Response } from 'express';
import Player from '../models/Player';
import { generateToken } from '../utils/jwtHelper';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/jwtHelper';
import getUserIdByToken from '../utils/getUserIdByToken';
import path from 'path';

export const loginPlayer = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const player = await Player.findOne({ username });

        if (!player) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const isMatch = await player.comparePassword(password);

        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(
            player._id as mongoose.Types.ObjectId,
            username
        );
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000 // 1 hour
        });
        res.status(200).json({
            message: 'Login successful',
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

export const registerPlayer = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { username, password, email } = req.body;

    if (!username || !password) {
        res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const existingPlayer = await Player.findOne({ username, email });

        if (existingPlayer) {
            res.status(409).json({
                message: 'Username or email already registered'
            });
            return;
        }

        const newPlayer = new Player({
            username,
            password,
            email
        });

        await newPlayer.save();

        const token = generateToken(
            newPlayer._id as mongoose.Types.ObjectId,
            username
        );
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000 // 1 hour
        });
        res.status(201).json({
            message: 'Registration successful',
            token: token
        });
    } catch {
        res.status(500).json({ message: 'Server error during registration' });
        return;
    }
};

export const updateProfile = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { username, password, email, old_password } = req.body;
    const playerId = getUserIdByToken(req.cookies.token);

    if (!playerId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    if (!mongoose.Types.ObjectId.isValid(playerId.toString())) {
        res.status(400).json({ message: 'Invalid player ID' });
        return;
    }

    if (!username) {
        res.status(400).json({ message: 'Username is required' });
        return;
    }
    if (password && !old_password) {
        res.status(400).json({
            message: 'Old password is required for password change'
        });
        return;
    }

    try {
        const player = await Player.findById(playerId);
        // Check if old password matches the current password
        if (!player) {
            res.status(404).json({ message: 'Player not found' });
            return;
        }
        if (old_password && password) {
            if (!(await player.comparePassword(old_password))) {
                res.status(403).json({ message: 'Old password is incorrect' });
                return;
            }
        }

        player.username = username;
        if (password) player.password = password;
        player.email = email;

        await player.save();

        res.status(200).json({
            message: 'Player updated successfully',
            player
        });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ message: 'Server error while updating player' });
    }
};

export const updateAvatar = async (
    req: Request,
    res: Response
): Promise<void> => {
    const playerId = getUserIdByToken(req.cookies.token);

    if (!playerId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }

    try {
        const player = await Player.findById(playerId);

        if (!player) {
            res.status(404).json({ message: 'Player not found' });
            return;
        }

        // Store the path to the uploaded avatar
        player.avatar = `uploads/avatars/${req.file.filename}`;
        await player.save();

        res.status(200).json({
            message: 'Avatar updated successfully',
            avatar: player.avatar
        });
    } catch (error) {
        console.error('Update avatar error:', error);
        res.status(500).json({ message: 'Server error while updating avatar' });
    }
};

export const getAvatar = async (req: Request, res: Response): Promise<void> => {
    const { playerId } = req.params;

    if (!playerId || !mongoose.Types.ObjectId.isValid(playerId)) {
        res.status(400).json({ message: 'Invalid player ID' });
        return;
    }

    try {
        const player = await Player.findById(playerId);

        if (!player) {
            res.status(404).json({ message: 'Player not found' });
            return;
        }

        if (!player.avatar) {
            res.status(404).json({ message: 'Avatar not found' });
            return;
        }

        res.sendFile(path.join(__dirname, '..', '..', player.avatar));
    } catch (error) {
        console.error('Get avatar error:', error);
        res.status(500).json({
            message: 'Server error while retrieving avatar'
        });
    }
};

export const getProfile = async (
    req: Request,
    res: Response
): Promise<void> => {
    const playerId = getUserIdByToken(req.cookies.token);

    if (!playerId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    try {
        const player = await Player.findById(playerId).select('-password');

        if (!player) {
            res.status(404).json({ message: 'Player not found' });
            return;
        }

        res.status(200).json({
            message: 'Profile retrieved successfully',
            player: {
                id: player._id,
                username: player.username,
                email: player.email
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            message: 'Server error while retrieving profile'
        });
    }
};

export const getUserProfile = async (
    req: Request,
    res: Response
): Promise<void> => {
    const playerId = req.params.playerId;

    if (!playerId || !mongoose.Types.ObjectId.isValid(playerId)) {
        res.status(400).json({ message: 'Invalid player ID' });
        return;
    }

    try {
        const player =
            await Player.findById(playerId).select('-password -email');

        if (!player) {
            res.status(404).json({ message: 'Player not found' });
            return;
        }

        res.status(200).json({
            message: 'Profile retrieved successfully',
            player: {
                id: player._id,
                username: player.username,
                avatar: player.avatar,
                wins: player.wins,
                losses: player.losses,
                draws: player.ties
            }
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            message: 'Server error while retrieving user profile'
        });
    }
};

export const verifyAuth = async (
    req: Request,
    res: Response
): Promise<void> => {
    const token = req.cookies.token;

    if (!token) {
        res.status(400).json({ message: 'Unauthorized' });
        return;
    }

    jwt.verify(token, JWT_SECRET, (err: unknown) => {
        if (err) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        res.status(200).json({
            message: 'Token is valid'
        });
    });
};

export const getToken = (req: Request, res: Response): void => {
    const token = req.cookies.token;

    if (!token) {
        res.status(400).json({ message: 'Unauthorized' });
        return;
    }

    jwt.verify(token, JWT_SECRET, (err: unknown) => {
        if (err) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        res.status(200).json({
            message: 'Token is valid',
            token
        });
    });
};

export const logoutPlayer = async (
    _req: Request,
    res: Response
): Promise<void> => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    });
    res.status(200).json({ message: 'Logout successful' });
};
