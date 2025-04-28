import { Router } from 'express';
import {
    loginPlayer,
    registerPlayer,
    verifyAuth,
} from '../controllers/authController';

const router = Router();

router.post('/login', loginPlayer);
router.post('/register', registerPlayer);
router.post('/verify', verifyAuth);

export default router;
