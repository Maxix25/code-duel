import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import Room from '../../models/Room';
import getUserIdByToken from '../../utils/getUserIdByToken';

const registerLeaveRoom = (io: Server, socket: Socket) => {
    socket.on(
        'leave_room',
        async (data: { roomId: string; user_token: string }) => {
            console.log(`Player ${socket.id} is leaving room ${data.roomId}`);
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
            room.players = room.players.filter(
                (p) => p.player.toString() !== userId.toString()
            );
            await room.save();
            socket.leave(data.roomId);
            if (room.players.length === 0 && room.status !== 'finished') {
                // If no players left, delete the room
                await Room.deleteOne({ _id: data.roomId });
                console.log(`Room ${data.roomId} deleted as no players left`);
            } else if (room.status === 'waiting' && room.players.length === 1) {
                console.log(
                    `Only one player left in room ${data.roomId}, removing ready button`
                );
                io.to(data.roomId).emit('remove_ready_button');
            }
            console.log(`Player ${socket.id} left room ${data.roomId}`);
        }
    );
};

export default registerLeaveRoom;
