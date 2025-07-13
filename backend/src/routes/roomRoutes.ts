import {
    getRoomQuestion,
    startRoom,
    getRoomResults,
} from '../controllers/roomController';
import { verifyToken } from '../middleware/verifyToken';
import { Router } from 'express';

const router = Router();

router.post('/start', verifyToken, startRoom);
router.get('/question/:roomId', verifyToken, getRoomQuestion);
router.get('/results/:roomId', verifyToken, getRoomResults);

export default router;
