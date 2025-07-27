import api from '../api';
import getToken from '../auth/getToken';

export interface Response {
    status: number;
    roomId: string | unknown;
}

const createRoom = async (): Promise<Response> => {
    try {
        const user_token = await getToken();
        const response = await api.post('/room/start', {
            user_token
        });
        console.log(response.status);
        return { status: response.status, roomId: response.data.roomId };
    } catch (error: unknown) {
        if (
            typeof error === 'object' &&
            error !== null &&
            'response' in error &&
            (error as any).response?.status === 400
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
