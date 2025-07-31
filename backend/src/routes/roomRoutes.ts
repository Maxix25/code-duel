import {
    getRoomQuestion,
    startRoom,
    getRoomResults,
    getUsersInRoom,
    getCurrentCode,
    getAllRooms,
    userIsInRoom,
    checkIfRoomHasPassword,
    validateRoomPassword
} from '../controllers/roomController';
import { verifyToken } from '../middleware/verifyToken';
import { Router } from 'express';

const router = Router();

router.post('/start', verifyToken, startRoom);
router.get('/question/:roomId', verifyToken, getRoomQuestion);
router.get('/results/:roomId', verifyToken, getRoomResults);
router.get('/users/:roomId', verifyToken, getUsersInRoom);
router.get('/userInRoom/', verifyToken, userIsInRoom);
router.get('/:roomId/code', verifyToken, getCurrentCode);
router.get('/all', verifyToken, getAllRooms);
router.get('/:roomId/check-password', verifyToken, checkIfRoomHasPassword);
router.post('/:roomId/validate-password', verifyToken, validateRoomPassword);

export default router;
