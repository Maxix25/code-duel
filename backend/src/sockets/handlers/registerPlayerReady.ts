import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import getUserIdByToken from '../../utils/getUserIdByToken';
import Room from '../../models/Room';
import Question from '../../models/Question';

const registerPlayerReady = (io: Server, socket: Socket) => {
    socket.on(
        'player_ready',
        async (data: { roomId: string; user_token: string }) => {
            if (!mongoose.isValidObjectId(data.roomId)) {
                socket.emit('error', 'Invalid room id');
                return;
            }
            const room = await Room.findById(data.roomId);
            if (!room) {
                socket.emit('error', 'Room not found');
                return;
            }
            const userId = getUserIdByToken(data.user_token);
            if (!userId) {
                socket.emit('error', 'Invalid token');
                return;
            }
            const player = room.players.find(
                (p: any) => p.player.toString() === userId.toString()
            );
            if (!player) {
                socket.emit('error', 'Player not found in room');
                return;
            }
            player.ready = true;
            await room.save();
            // Check if all players are ready
            const allReady = room.players.every((p: any) => p.ready);
            if (allReady) {
                room.status = 'playing';
                await room.save();
                // NOTE: The question data that's sent to the client should provide only the necessary fields
                const question = await Question.findById(room.problemId);
                console.log('All players are ready, starting game');
                io.to(data.roomId).emit('start_game', question);
            }
        }
    );
};

export default registerPlayerReady;
