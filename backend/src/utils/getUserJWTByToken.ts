import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './jwtHelper';

const getUserJWTByToken = (
    token: string
): { id: string; username: string; isOAuth: boolean } | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: string;
            username: string;
            isOAuth: boolean;
        };
        return {
            id: decoded.id,
            username: decoded.username,
            isOAuth: decoded.isOAuth
        };
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};
export default getUserJWTByToken;
