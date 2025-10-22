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
                socket.emit('error', {
                    type: 'redirect',
                    message: 'Room not found'
                });
                return;
            }
            if (!userId) {
                socket.emit('error', {
                    type: 'redirect',
                    message: 'Invalid token'
                });
                return;
            }
            // Check if the room admits one more player
            if (room.players.length + 1 > room.maxCapacity) {
                socket.emit('error', {
                    type: 'redirect',
                    message: 'Room is full'
                });
                return;
            }
            if (room.status === 'finished') {
                socket.emit('error', {
                    type: 'redirect',
                    message: 'This room is no longer playing'
                });
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
                try {
                    room.players.push({
                        player: userId as mongoose.Schema.Types.ObjectId,
                        score: 0,
                        ready: false,
                        current_code: question.startingCode
                    });
                    await room.save();
                } catch {
                    console.error(
                        'Error adding player to room on the db, probably because the player is already in the room'
                    );
                }
            }
            // Join the room in socket.io and store userId in socket data
            socket.data.userId = userId.toString();
            socket.join(data.roomId);
            if (room.status === 'waiting' && room.players.length >= 2) {
                console.log(`Room ${data.roomId} is ready to start`);
                // Emit add_ready_button only to players who are not ready
                for (const player of room.players) {
                    if (!player.ready) {
                        // Find the socket for this player and emit to them
                        const socketsInRoom = await io
                            .in(data.roomId)
                            .fetchSockets();
                        for (const clientSocket of socketsInRoom) {
                            // Store player ID in socket data when they join
                            if (
                                clientSocket.data.userId ===
                                player.player.toString()
                            ) {
                                clientSocket.emit('add_ready_button');
                                break;
                            }
                        }
                    }
                }
            }
            console.log(`Player ${socket.id} joined room ${data.roomId}`);
        }
    );
};

export default registerJoinRoom;
