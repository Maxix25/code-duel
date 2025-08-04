import api from '../api';
import { AxiosResponse } from 'axios';

const getProfile = async (): Promise<AxiosResponse> => {
    try {
        const response = await api.get('/auth/profile');
        return response;
    } catch (error) {
        console.error('Error getting profile:', error);
        throw error;
    }
};

export default getProfile;
