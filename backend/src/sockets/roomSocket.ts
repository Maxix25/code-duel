import { Server, Socket } from 'socket.io';
import runCode from '../api/runCode';

const roomSocket = (io: Server, socket: Socket) => {
    socket.on(
        'submit_solution',
        async (data: { code: string; roomId: string }) => {
            await runCode(data.code, 'python')
                .then((response) => {
                    const { stdout, stderr, compile_output, message } =
                        response;
                    const result = {
                        stdout: stdout || '',
                        stderr: stderr || '',
                        compile_output: compile_output || '',
                        message: message || '',
                    };
                    socket.emit('solution_result', result);
                })
                .catch((error) => {
                    console.error('Error running code:', error);
                    socket.emit('solution_result', {
                        error: 'Error running code',
                    });
                });
        }
    );
    socket.on('join_room', (roomId: string) => {
        socket.join(roomId);
        console.log(`Player ${socket.id} joined room ${roomId}`);
    });
};

export default roomSocket;
