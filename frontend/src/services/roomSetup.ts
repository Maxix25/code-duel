import socket from './socket';
import { Dispatch, SetStateAction } from 'react';
import getQuestion from '../api/room/getQuestion';
import { NavigateFunction } from 'react-router-dom';

interface Judge0Response {
    stdout: string | null;
    stderr: string | null;
    compile_output: string | null;
    message: string | null;
    status_id: number;
    token: string;
}
export interface SolutionResult {
    result: Judge0Response;
    testCase: string;
    expectedOutput: string;
}

/**
 * Sets up the room for the user by joining the socket room and fetching the question.
 * @param roomId - The ID of the room to join.
 * @param setOutput - State setter for the output of the code execution.
 * @param setProblemStatement - State setter for the problem statement.
 * @param setIsRunning - State setter for the running state of the code.
 * @param setCode - State setter for the code editor content.
 * @returns The question object fetched from the server.
 */

const roomSetup = async (
    roomId: string,
    setOutput: Dispatch<SetStateAction<SolutionResult[] | string>>,
    setProblemStatement: Dispatch<SetStateAction<string>>,
    setIsRunning: Dispatch<SetStateAction<boolean>>,
    setCode: Dispatch<SetStateAction<string>>,
    navigate: NavigateFunction
) => {
    socket.connect();
    socket.emit('join_room', {
        roomId,
        user_token: localStorage.getItem('token'),
    });
    socket.on('solution_result', (data: SolutionResult[]) => {
        setIsRunning(false);
        console.log('Solution result:', data);
        setOutput(data)

    });
    socket.on('error', (data: string) => {
        if (data === 'Invalid room id') {
            navigate('/dashboard');
        }
    });
    const Question = await getQuestion(roomId);
    setProblemStatement(Question.question);
    setCode(Question.startingCode);
    return Question;
};

export default roomSetup;
