import { Router } from 'express';
import { loginPlayer, registerPlayer } from '../controllers/authController';

const router = Router();

router.post('/login', loginPlayer);
router.post('/register', registerPlayer);

export default router;
