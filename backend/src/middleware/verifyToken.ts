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
): void => {
    jwt.verify(req.cookies.token, JWT_SECRET, (err: unknown) => {
        if (err) {
            console.log('Token verification failed:', err);
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        next();
    });
};
