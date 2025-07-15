import { Server, Socket } from 'socket.io';
import runCode from '../api/runCode';
import Room from '../models/Room';
import mongoose from 'mongoose';
import Player from '../models/Player';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/jwtHelper';
import getUsernameByToken from '../utils/getUsernameByToken';
import getUserIdByToken from '../utils/getUserIdByToken';
import Question from '../models/Question';
import getSubmission, { Judge0Response } from '../api/getSubmission';
import getQuestionById from '../utils/getQuestionById';

const roomSocket = (io: Server, socket: Socket) => {
    socket.on(
        'submit_solution',
        async (data: { code: string; roomId: string; user_token: string }) => {
            const username = getUsernameByToken(data.user_token);
            const userId = getUserIdByToken(data.user_token);
            let room;
            if (mongoose.isValidObjectId(data.roomId)) {
                room = await Room.findById(data.roomId);
                if (!room) {
                    socket.emit('error', 'Room not found');
                    return;
                }
            } else {
                socket.emit('error', 'Invalid room id');
                return;
            }

            if (!username) {
                socket.emit('error', 'Invalid token');
                return;
            }
            const question = await Question.findOne({
                _id: room.problemId,
            });
            if (!question) {
                socket.emit('error', 'Question not found');
                return;
            }
            const results: {
                result: Judge0Response;
                testCase: string;
                expectedOutput: string;
            }[] = [];
            for (const testCase of question.testCases) {
                const token = await runCode(
                    data.code,
                    'python',
                    data.roomId,
                    testCase.stdin,
                    testCase.expectedOutput
                );
                let submission = await getSubmission(token);
                // Only for cloud
                await new Promise((resolve) => setTimeout(resolve, 1500));

                // Still processing
                while (true) {
                    if (submission.status_id <= 2) {
                        await new Promise((resolve) =>
                            setTimeout(resolve, 2000)
                        );
                        submission = await getSubmission(token);
                    } else {
                        const result = {
                            result: submission,
                            testCase: testCase.stdin,
                            expectedOutput: testCase.expectedOutput,
                        };
                        results.push(result);
                        break;
                    }
                }
            }
            // Check if all test cases passed
            const allPassed = results.every(
                (result) => result.result.status_id === 3
            );
            if (allPassed) {
                // Add score to player
                if (!userId) {
                    socket.emit('error', 'Invalid token');
                    return;
                }
                const player = await Player.findOne({
                    _id: userId,
                });
                if (!player) {
                    socket.emit('error', 'Player not found');
                    return;
                }
                for (const p of room.players) {
                    // Check if player is the one who submitted
                    if (p.player.toString() === userId.toString()) {
                        const problem = await getQuestionById(
                            room.problemId.toString()
                        );
                        if (problem) {
                            // Set score to number of test cases
                            p.score = problem.testCases.length;
                            await room.save();
                        }
                    }
                }
                room.status = 'finished';
                await room.save();
                io.to(data.roomId).emit('winner', {
                    username,
                });
                return;
            } else {
                // Count testcases passed
                const passedCount = results.filter(
                    (result) => result.result.status_id === 3
                ).length;
                // Update score in room
                // Get current score and update only if passedCount is higher
                const roomDoc = await Room.findOne(
                    { _id: data.roomId, 'players.player': userId },
                    { 'players.$': 1 }
                );
                const currentScore = roomDoc?.players?.[0]?.score ?? 0;
                if (passedCount > currentScore) {
                    await Room.updateOne(
                        { _id: data.roomId, 'players.player': userId },
                        { $set: { 'players.$.score': passedCount } }
                    ).catch((err) => {
                        console.error('Error updating score:', err);
                    });
                }
            }
            socket.emit('solution_result', results);
        }
    );
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
            let username: string;
            try {
                const decoded = jwt.verify(data.user_token, JWT_SECRET) as {
                    username: string;
                };
                username = decoded.username;
            } catch (err) {
                console.log('Invalid token');
                socket.emit('error', 'Invalid token');
                return;
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
                io.to(data.roomId).emit('start_game', question);
                return;
            }
            room.players.push({
                player: userId as mongoose.Schema.Types.ObjectId,
                score: 0,
                ready: false,
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
                (p: any) => p.player.toString() !== userId.toString()
            );
            await room.save();
            socket.leave(data.roomId);
            if (room.players.length === 0) {
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
                io.to(data.roomId).emit('start_game', question);
            }
        }
    );
};

export default roomSocket;
