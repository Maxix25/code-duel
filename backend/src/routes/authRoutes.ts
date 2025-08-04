import { Router } from 'express';
import {
    loginPlayer,
    registerPlayer,
    updatePlayer,
    getProfile,
    verifyAuth,
    logoutPlayer,
    getToken
} from '../controllers/authController';
import { verifyToken } from '../middleware/verifyToken';

const router = Router();

router.post('/login', loginPlayer);
router.post('/register', registerPlayer);
router.put('/update', verifyToken, updatePlayer);
router.get('/profile', verifyToken, getProfile);
router.post('/verify', verifyAuth);
router.get('/logout', logoutPlayer);
router.get('/token', getToken);

export default router;
