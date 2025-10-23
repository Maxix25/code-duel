import { Router } from 'express';
import {
    updateProfile,
    updateAvatar,
    getAvatar,
    getProfile,
    getUserProfile
} from '../controllers/profileController';
import { upload } from '../multerConfig';
import { verifyToken } from '../middleware/verifyToken';

const router = Router();

router.put('/update', verifyToken, updateProfile);
router.post('/avatar', verifyToken, upload.single('avatar'), updateAvatar);
router.get('/avatar/:playerId', verifyToken, getAvatar);
router.get('/', verifyToken, getProfile);
router.get('/:playerId', verifyToken, getUserProfile);

export default router;
