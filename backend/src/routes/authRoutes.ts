import { Router } from 'express';
import {
    loginPlayer,
    registerPlayer,
    updateProfile,
    updateAvatar,
    getProfile,
    getUserProfile,
    getAvatar,
    verifyAuth,
    logoutPlayer,
    getToken,
    handleGoogleAuth
} from '../controllers/authController';
import { verifyToken } from '../middleware/verifyToken';
import { upload } from '../multerConfig';
import passport from '../auth/passport';

const router = Router();

router.post('/login', loginPlayer);
router.post('/register', registerPlayer);
router.put('/update', verifyToken, updateProfile);
router.put('/avatar', verifyToken, upload.single('avatar'), updateAvatar);
router.get('/avatar/:playerId', verifyToken, getAvatar);
router.get('/profile', verifyToken, getProfile);
router.get('/profile/:playerId', verifyToken, getUserProfile);
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
