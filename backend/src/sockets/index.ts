import { Server, Socket } from 'socket.io';
import socketEvents from './events';

const registerSocketHandlers = (io: Server, socket: Socket) => {
    socketEvents(io, socket);
};

export default registerSocketHandlers;
