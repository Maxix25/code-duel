import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './jwtHelper';
import { Types } from 'mongoose';

/**
 * Retrieves the user id from a JWT token.
 * @param token The JWT token to decode.
 * @returns The user id if present, otherwise null.
 * @throws Will throw an error if the token is invalid or expired.
 */

export default function getUserIdByToken(token: string): Types.ObjectId | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: Types.ObjectId };
        return decoded.id;
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
}
