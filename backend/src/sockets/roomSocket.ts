import { Server, Socket } from 'socket.io';
import runCode from '../api/runCode';
import Room from '../models/Room';
import { Types } from 'mongoose';
import Player from '../models/Player';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/jwtHelper';
import getUsernameByToken from '../utils/getUsernameByToken';
import Question from '../models/Question';
import getSubmission, { Judge0Response } from '../api/getSubmission';

const roomSocket = (io: Server, socket: Socket) => {
    socket.on(
        'submit_solution',
        async (data: { code: string; roomId: string; user_token: string }) => {
            const username = getUsernameByToken(data.user_token);
            const room = await Room.findById(data.roomId);

            if (!room) {
                console.log('Room not found');
                socket.emit('error', 'Room not found');
                return;
            }
            if (!username) {
                console.log('Invalid token');
                socket.emit('error', 'Invalid token');
                return;
            }
            const question = await Question.findOne({
                _id: room.problemId,
            });
            if (!question) {
                console.log('Question not found');
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
                console.log('Token:', token);
                let submission = await getSubmission(token);
                console.log('Submission:', submission);
                // Only for cloud
                await new Promise((resolve) =>
                    setTimeout(resolve, 1500)
                );

                // Still processing
                while (true) {
                    if (submission.status_id <= 2) {
                        console.log('Still processing...', submission);
                        await new Promise((resolve) =>
                            setTimeout(resolve, 2000)
                        );
                        submission = await getSubmission(token);
                    } else {
                        const result = {
                            result: submission,
                            testCase: testCase.stdin,
                            expectedOutput: testCase.expectedOutput,
                        }
                        results.push(result);
                        break;
                    }
                }
            };
            console.log('Results:', results);
            socket.emit('solution_result', results)
        }
    );
    socket.on(
        'join_room',
        async (data: { roomId: string; user_token: string }) => {
            const room = await Room.findById(data.roomId);
            let username: string;
            try {
                const decoded = jwt.verify(data.user_token, JWT_SECRET) as {
                    username: string;
                };
                username = decoded.username;
            } catch (err) {
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
                room.players
                    .map((id: any) => id.toString())
                    .includes(userId.toString())
            ) {
                socket.emit('error', 'Already in room');
                return;
            }
            room.players.push(userId as Types.ObjectId);
            await room.save();
            socket.join(data.roomId);
            console.log(`Player ${socket.id} joined room ${data.roomId}`);
        }
    );
};

export default roomSocket;
