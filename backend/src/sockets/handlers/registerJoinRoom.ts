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
            let appendPlayer = true;
            if (!room) {
                socket.emit('error', 'Room not found');
                return;
            }
            if (!userId) {
                socket.emit('error', 'Invalid token');
                return;
            }

            const question = await Question.findById(room.problemId);

            if (!question) {
                socket.emit('error', 'Question not found');
                return;
            }
            // Check if the room is already running and if user is not in the room
            if (
                room.status === 'playing' &&
                !room.players.some(
                    (p) => p.player.toString() === userId.toString()
                )
            ) {
                socket.emit('error', 'Room is already running');

                return;
            }
            // Check if the token is valid
            try {
                jwt.verify(data.user_token, JWT_SECRET) as {
                    username: string;
                };
            } catch {
                socket.emit('error', 'Invalid token');
                return;
            }
            // Check if the user is already in the room
            if (
                userId &&
                room.players
                    .map((p) => p.player.toString())
                    .includes(userId.toString())
            ) {
                // User is already in the room, just join socket
                appendPlayer = false;
                console.log(
                    `Player ${socket.id} re-joined room ${data.roomId}`
                );
                if (room.status === 'playing') {
                    socket.emit('rejoin_game', question);
                }
            }
            if (appendPlayer) {
                room.players.push({
                    player: userId as mongoose.Schema.Types.ObjectId,
                    score: 0,
                    ready: false,
                    current_code: question.startingCode
                });
                await room.save();
            }
            // Join the room in socket.io
            socket.join(data.roomId);
            if (room.status === 'waiting' && room.players.length >= 2) {
                console.log(`Room ${data.roomId} is ready to start`);
                io.to(data.roomId).emit('add_ready_button');
            }
            console.log(`Player ${socket.id} joined room ${data.roomId}`);
        }
    );
};

export default registerJoinRoom;
