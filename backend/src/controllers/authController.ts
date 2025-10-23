import { Request, Response } from 'express';
import Player from '../models/Player';
import { generateToken } from '../utils/jwtHelper';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/jwtHelper';

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

export const handleGoogleAuth = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        // Get the user from passport authentication
        const user = req.user as typeof Player.prototype;

        if (!user) {
            res.status(400).json({
                message: 'Authentication failed'
            });
            return;
        }

        // Generate JWT token
        const token = generateToken(
            user._id as mongoose.Types.ObjectId,
            user.username
        );

        // Set token as httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000 // 1 hour
        });

        // Redirect to frontend dashboard
        const redirectUrl = `${process.env.FE_BASE_URL}/dashboard`;
        res.redirect(redirectUrl);
    } catch (error) {
        console.error('Google OAuth callback error:', error);
        res.status(500).json({
            message: 'An error occurred during authentication',
            error
        });
    }
};
