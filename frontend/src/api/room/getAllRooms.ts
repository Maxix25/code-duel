import api from '../api';

const getAllRooms = async () => {
    try {
        const response = await api.get('/room/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching all rooms:', error);
        throw error;
    }
};
export default getAllRooms;
