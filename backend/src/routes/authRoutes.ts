import { Router } from 'express';
import {
    loginPlayer,
    registerPlayer,
    verifyAuth,
    logoutPlayer,
    getToken
} from '../controllers/authController';

const router = Router();

router.post('/login', loginPlayer);
router.post('/register', registerPlayer);
router.post('/verify', verifyAuth);
router.get('/logout', logoutPlayer);
router.get('/token', getToken);

export default router;
