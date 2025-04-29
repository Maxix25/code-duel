import { startRoom } from '../controllers/roomController';
import { verifyToken } from '../middleware/verifyToken';
import { Router } from 'express';

const router = Router();

router.get('/question', verifyToken, startRoom);

export default router;
