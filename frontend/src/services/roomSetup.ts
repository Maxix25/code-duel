import socket from './socket';
import { Dispatch, SetStateAction } from 'react';
import getQuestion from '../api/room/getQuestion';

const roomSetup = async (
    roomId: string,
    setOutput: Dispatch<SetStateAction<string>>,
    setProblemStatement: Dispatch<SetStateAction<string>>,
    setIsRunning: Dispatch<SetStateAction<boolean>>,
    setCode: Dispatch<SetStateAction<string>>
) => {
    socket.connect();
    socket.emit('join_room', roomId);
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
    const Question = await getQuestion();
    console.log('Question:', Question);
    setProblemStatement(Question.question);
    setCode(Question.startingCode);
    return Question;
};

export default roomSetup;
