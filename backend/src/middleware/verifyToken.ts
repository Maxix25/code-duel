import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/jwtHelper';

/**
 * Middleware to verify JWT token in the request headers.
 * If the token is valid, it adds the decoded user information to the request object.
 * Otherwise, it sends a 401 Unauthorized response.
 */
export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    const authHeader =
        req.headers['authorization'] || req.headers['Authorization'];
    const token =
        typeof authHeader === 'string' ? authHeader.split(' ')[1] : undefined;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    });
    next();
};
