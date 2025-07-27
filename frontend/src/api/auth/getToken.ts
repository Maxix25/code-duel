import api from '../api';

const getToken = async (): Promise<string | null> => {
    try {
        const response = await api.get('/auth/token');
        return response.data.token;
    } catch (error) {
        console.error('Error fetching token:', error);
        return null;
    }
};

export default getToken;
