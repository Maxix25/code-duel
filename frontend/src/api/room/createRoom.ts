import api from '../api';

interface Response {
    roomId: string;
}

const createRoom = async (): Promise<Response> => {
    try {
        const response = await api.post('/room/start');
        return response.data;
    } catch (error) {
        console.error('Error creating room:', error);
        throw error;
    }
};

export default createRoom;
