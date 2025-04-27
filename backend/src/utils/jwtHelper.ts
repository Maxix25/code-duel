import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'Some secret key';
const JWT_EXPIRATION = '1h';

/**
 * Generates a new JWT token for a player.
 * @param playerId Player ID to include in the token payload.
 * @returns The generated JWT token.
 */
export const generateToken = (playerId: mongoose.Types.ObjectId): string => {
    const payload = {
        id: playerId,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION,
    });

    return token;
};

/**
 * Verifies a JWT token and returns the decoded payload.
 * @param token The JWT token to verify.
 * @returns The decoded payload if the token is valid, or null if invalid.
 */
export const verifyToken = (token: string): Record<string, any> | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded as Record<string, any>;
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};
