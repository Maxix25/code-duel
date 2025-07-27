import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import Room from '../../models/Room';
import Question from '../../models/Question';
import getUserIdByToken from '../../utils/getUserIdByToken';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../utils/jwtHelper';

const registerJoinRoom = (io: Server, socket: Socket) => {
    socket.on(
        'join_room',
        async (data: { roomId: string; user_token: string }) => {
            if (!mongoose.isValidObjectId(data.roomId)) {
                socket.emit('error', 'Invalid room id');
                return;
            }
            const room = await Room.findById(data.roomId);
            const userId = getUserIdByToken(data.user_token);
            if (!room) {
                console.log('Room not found');
                socket.emit('error', 'Room not found');
                return;
            }
            if (!userId) {
                console.log('Invalid token');
                socket.emit('error', 'Invalid token');
                return;
            }
            const question = await Question.findById(room.problemId);

            if (!question) {
                console.log('Question not found');
                socket.emit('error', 'Question not found');
                return;
            }
            // Check if the room is already running and if user is not in the room
            if (
                room.status === 'playing' &&
                !room.players.some(
                    (p: any) => p.player.toString() === userId.toString()
                )
            ) {
                socket.emit('error', 'Room is already running');
                return;
            }
            try {
                jwt.verify(data.user_token, JWT_SECRET) as {
                    username: string;
                };
            } catch {
                room.players
                    .map((p: any) => p.player.toString())
                    .includes(userId.toString());
            }

            if (
                userId &&
                room.players
                    .map((p: any) => p.player.toString())
                    .includes(userId.toString())
            ) {
                // User is already in the room, just join socket
                socket.join(data.roomId);
                console.log(
                    `Player ${socket.id} re-joined room ${data.roomId}`
                );
                if (room.status === 'playing') {
                    socket.emit('start_game', question);
                }
                return;
            }
            room.players.push({
                player: userId as mongoose.Schema.Types.ObjectId,
                score: 0,
                ready: false,
                current_code: question.startingCode
            });
            await room.save();
            socket.join(data.roomId);
            // If the room is waiting and has at least 2 players, emit add_ready_button
            if (room.status === 'waiting' && room.players.length >= 2) {
                io.to(data.roomId).emit('add_ready_button');
            }
            console.log(`Player ${socket.id} joined room ${data.roomId}`);
        }
    );
};

export default registerJoinRoom;
