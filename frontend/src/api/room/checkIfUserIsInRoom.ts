import api from '../api';

const checkIfUserIsInRoom = async (): Promise<{
    inRoom: boolean;
    roomId?: string;
}> => {
    try {
        const response = await api.get(`/room/userInRoom`);
        return response.data;
    } catch (error) {
        console.error('Error checking if user is in room:', error);
        throw error;
    }
};

export default checkIfUserIsInRoom;
