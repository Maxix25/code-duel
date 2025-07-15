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
    setIsRunning: Dispatch<SetStateAction<boolean>>,
    setReadyButton: Dispatch<SetStateAction<boolean>>,
    navigate: NavigateFunction
) => {
    // Clear previous socket listeners to avoid memory leaks
    socket.off('connect');
    socket.off('solution_result');
    socket.off('error');
    socket.off('winner');
    socket.off('reconnect');
    socket.off('add_ready_button');
    socket.off('remove_ready_button');

    socket.on('connect', () => {
        console.log('Connected to socket server');
        socket.emit('join_room', {
            roomId,
            user_token: localStorage.getItem('token'),
        });
    });
    socket.on('reconnect', () => {
        console.log('Reconnected to socket server');
        socket.emit('join_room', {
            roomId,
            user_token: localStorage.getItem('token'),
        });
    });
    socket.connect();
    socket.on('solution_result', (data: SolutionResult[]) => {
        setIsRunning(false);
        console.log('Solution result:', data);
        setOutput(data);
    });
    socket.on('error', (data: string) => {
        if (data === 'Invalid room id') {
            navigate('/dashboard');
        }
        console.log('Error:', data);
    });
    socket.on('winner', (data: { username: string }) => {
        setIsRunning(false);
        setOutput('We have a winner! ' + data.username);
        console.log('Winner:', data.username);
    });
    socket.on('add_ready_button', () => {
        setReadyButton(true);
    });
    socket.on('remove_ready_button', () => {
        setReadyButton(false);
    });
};

export default roomSetup;
