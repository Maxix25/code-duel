import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './jwtHelper';

const getUsernameByToken = (token: string): string | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { username: string };
        return decoded.username;
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};

export default getUsernameByToken;
