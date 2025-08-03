import api from '../api';

export interface Response {
    status: number;
    roomId: string | unknown;
}

const createRoom = async (password: string): Promise<Response> => {
    try {
        const response = await api.post('/room/start', {
            password
        });
        console.log(response.status);
        return { status: response.status, roomId: response.data.roomId };
    } catch (error: unknown) {
        if (
            typeof error === 'object' &&
            error !== null &&
            'response' in error &&
            (error as { response?: { status?: number } }).response?.status ===
                400
        ) {
            const err = error as {
                response: { data: { roomId: string | unknown } };
            };
            return { status: 400, roomId: err.response.data.roomId };
        }
        // Return a default Response if error is not handled above
        console.error('Error creating room:', error);
        return { status: 500, roomId: '' };
    }
};

export default createRoom;
