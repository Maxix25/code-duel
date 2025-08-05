import { Router } from 'express';
import {
    loginPlayer,
    registerPlayer,
    updateProfile,
    updateAvatar,
    getProfile,
    getAvatar,
    verifyAuth,
    logoutPlayer,
    getToken
} from '../controllers/authController';
import { verifyToken } from '../middleware/verifyToken';
import { upload } from '../multerConfig';

const router = Router();

router.post('/login', loginPlayer);
router.post('/register', registerPlayer);
router.put('/update', verifyToken, updateProfile);
router.put('/avatar', verifyToken, upload.single('avatar'), updateAvatar);
router.get('/avatar/:playerId', verifyToken, getAvatar);
router.get('/profile', verifyToken, getProfile);
router.post('/verify', verifyAuth);
router.get('/logout', logoutPlayer);
router.get('/token', getToken);

export default router;
