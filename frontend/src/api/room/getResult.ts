import api from '../api';

/**
 * Fetches the results for a specific room.
 * @param {string} roomId - The ID of the room to fetch results for.
 * @returns {Promise<any>} - A promise that resolves to the results data.
 */

interface RoomResult {
    results: {
        playerId: string;
        username: string;
        score: number;
    }[];
}

const getResult = async (roomId: string): Promise<RoomResult> => {
    try {
        const response = await api.get<RoomResult>(`/room/results/${roomId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching results:', error);
        throw error;
    }
};

export default getResult;
