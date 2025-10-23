import { Router } from 'express';
import {
    loginPlayer,
    registerPlayer,
    verifyAuth,
    logoutPlayer,
    getToken,
    handleGoogleAuth
} from '../controllers/authController';
import passport from '../auth/passport';

const router = Router();

router.post('/login', loginPlayer);
router.post('/register', registerPlayer);
router.post('/verify', verifyAuth);
router.get('/logout', logoutPlayer);
router.get('/token', getToken);

// OAuth google
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    handleGoogleAuth
);

export default router;
