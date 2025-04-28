import api from '../api';
import { AxiosResponse } from 'axios';

const login = async (data: {
    username: string;
    password: string;
}): Promise<AxiosResponse> => {
    try {
        const response = await api.post('/auth/login', data);
        return response;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};
export default login;
