import api from '../api';

const checkIfRoomHasPassword = async (roomId: string): Promise<boolean> => {
    try {
        const response = await api.get(`/room/${roomId}/check-password`);
        console.log('Room password check response:', response.data);
        return response.data.hasPassword;
    } catch (error) {
        console.error('Error checking room password:', error);
        return false;
    }
};

export default checkIfRoomHasPassword;
