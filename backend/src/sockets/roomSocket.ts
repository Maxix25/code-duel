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
                console.log('All test cases passed');
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
            let append = true;
            if (!mongoose.isValidObjectId(data.roomId)) {
                socket.emit('error', 'Invalid room id');
                return;
            }
            const room = await Room.findById(data.roomId);
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
            const player = await Player.findOne({
                username,
            });
            const userId = player && player._id ? player._id : null;
            if (!userId) {
                console.log('User not found');
                socket.emit('error', 'Invalid token');
                return;
            }
            if (!room) {
                console.log('Room not found');
                socket.emit('error', 'Room not found');
                return;
            }
            if (
                userId &&
                room.players
                    .map((p: any) => p.player.toString())
                    .includes(userId.toString())
            ) {
                socket.emit('error', 'Already in room');
                append = false;
            }
            room.players.push({
                player: userId as mongoose.Schema.Types.ObjectId,
                score: 0,
            });
            if (append) {
                await room.save();
            }
            socket.join(data.roomId);
            console.log(`Player ${socket.id} joined room ${data.roomId}`);
        }
    );
};

export default roomSocket;
