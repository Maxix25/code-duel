import { Socket } from 'socket.io';
import Room from '../../models/Room';
import getUserIdByToken from '../../utils/getUserIdByToken';

const registerCodeSave = (socket: Socket) => {
    socket.on(
        'code_save',
        async (data: { roomId: string; code: string; user_token: string }) => {
            const room = await Room.findById(data.roomId);
            if (!room) {
                socket.emit('error', 'Room not found');
                return;
            }
            const userId = getUserIdByToken(data.user_token);
            if (!userId) {
                socket.emit('error', 'Invalid user token');
                return;
            }
            const playerIndex = room.players.findIndex(
                (p) => p.player.toString() === userId.toString()
            );
            if (playerIndex === -1) {
                socket.emit('error', 'User not found in room');
                return;
            }
            room.players[playerIndex].current_code = data.code;
            await room.save();
            // TODO: Emit an event to submit feedback to the frontend that the code is saved
        }
    );
};

export default registerCodeSave;
