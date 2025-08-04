import api from '../api';
import { AxiosResponse } from 'axios';

const updateProfile = async (data: {
    username: string;
    password: string;
    email: string;
    old_password: string;
}): Promise<AxiosResponse> => {
    try {
        const response = await api.put('/auth/update', data);
        return response;
    } catch (error) {
        console.error('Error during profile update:', error);
        throw error;
    }
};

export default updateProfile;
