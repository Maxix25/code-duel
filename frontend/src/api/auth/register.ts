import api from '../api';
import { AxiosResponse } from 'axios';

const register = async (data: {
    username: string;
    email: string;
    password: string;
}): Promise<AxiosResponse> => {
    try {
        const response = await api.post('/auth/register', data);
        return response;
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
};

export default register;
