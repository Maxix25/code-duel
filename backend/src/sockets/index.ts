import { Server, Socket } from 'socket.io';
import roomSocket from './roomSocket';

const registerSocketHandlers = (io: Server, socket: Socket) => {
    roomSocket(io, socket);
};

export default registerSocketHandlers;
