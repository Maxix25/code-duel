import { Server, Socket } from 'socket.io';
import getUsernameByToken from '../../utils/getUsernameByToken';
import getUserIdByToken from '../../utils/getUserIdByToken';
import mongoose from 'mongoose';
import Room from '../../models/Room';
import Player from '../../models/Player';
import Question from '../../models/Question';
import { Judge0Response } from '../../api/getSubmission';
import runCode from '../../api/runCode';
import getSubmission from '../../api/getSubmission';
import getQuestionById from '../../utils/getQuestionById';
const registerSubmitSolution = (io: Server, socket: Socket) => {
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
                _id: room.problemId
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
                            expectedOutput: testCase.expectedOutput
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
                    _id: userId
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
                        }
                    }
                }
                player.wins += 1;
                room.status = 'finished';
                await room.save();
                await player.save();
                io.to(data.roomId).emit('winner', {
                    username
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
};
export default registerSubmitSolution;
