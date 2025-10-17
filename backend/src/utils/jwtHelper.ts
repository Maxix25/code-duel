import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const JWT_SECRET = process.env.JWT_SECRET || 'Some secret key';
export const JWT_EXPIRATION = '1h';

/**
 * Generates a new JWT token for a player.
 * @param playerId Player ID to include in the token payload.
 * @param username Player username to include in the token payload.
 * @param isOAuth Boolean indicating if the player is authenticated via OAuth.
 * @returns The generated JWT token.
 */
export const generateToken = (
    playerId: mongoose.Types.ObjectId,
    username: string,
    isOAuth: boolean = false
): string => {
    const payload = {
        id: playerId,
        username,
        isOAuth
    };

    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION
    });

    return token;
};
