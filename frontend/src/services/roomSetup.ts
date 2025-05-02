import socket from './socket';
import { Dispatch, SetStateAction } from 'react';
import getQuestion from '../api/room/getQuestion';

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
    setOutput: Dispatch<SetStateAction<string>>,
    setProblemStatement: Dispatch<SetStateAction<string>>,
    setIsRunning: Dispatch<SetStateAction<boolean>>,
    setCode: Dispatch<SetStateAction<string>>
) => {
    socket.connect();
    socket.emit('join_room', {
        roomId,
        user_token: localStorage.getItem('token'),
    });
    socket.on('solution_result', (data) => {
        setIsRunning(false);
        if (data.error) {
            setOutput(data.error);
        } else {
            setOutput(
                data.stdout ||
                    data.stderr ||
                    data.compile_output ||
                    data.message
            );
        }
    });
    const Question = await getQuestion(roomId);
    console.log('Question:', Question);
    setProblemStatement(Question.question);
    setCode(Question.startingCode);
    return Question;
};

export default roomSetup;
