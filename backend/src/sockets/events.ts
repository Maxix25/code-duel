import { Server, Socket } from 'socket.io';
import registerSubmitSolution from './handlers/registerSubmitSolution';
import registerJoinRoom from './handlers/registerJoinRoom';
import registerLeaveRoom from './handlers/registerLeaveRoom';
import registerPlayerReady from './handlers/registerPlayerReady';
import registerCodeSave from './handlers/registerCodeSave';

const roomSocket = (io: Server, socket: Socket) => {
    registerSubmitSolution(io, socket);
    registerJoinRoom(io, socket);
    registerLeaveRoom(io, socket);
    registerPlayerReady(io, socket);
    registerCodeSave(socket);
};

export default roomSocket;
