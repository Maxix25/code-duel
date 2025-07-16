import api from '../api';

const getUsersInRoom = async (roomId: string) => {
    try {
        const response = await api.get(`/room/users/${roomId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users in room:', error);
        throw error;
    }
};

export default getUsersInRoom;
