import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const JWT_SECRET = process.env.JWT_SECRET || 'Some secret key';
export const JWT_EXPIRATION = '1h';

/**
 * Generates a new JWT token for a player.
 * @param playerId Player ID to include in the token payload.
 * @returns The generated JWT token.
 */
export const generateToken = (
    playerId: mongoose.Types.ObjectId,
    username: string
): string => {
    const payload = {
        id: playerId,
        username
    };

    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION
    });

    return token;
};
