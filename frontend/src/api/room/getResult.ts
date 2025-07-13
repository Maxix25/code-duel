import api from '../api';

/**
 * Fetches the results for a specific room.
 * @param {string} roomId - The ID of the room to fetch results for.
 * @returns {Promise<any>} - A promise that resolves to the results data.
 */

const getResult = async (roomId: string): Promise<any> => {
    try {
        const response = await api.get(`/room/${roomId}/results`);
        return response.data;
    } catch (error) {
        console.error('Error fetching results:', error);
        throw error;
    }
};

export default getResult;
