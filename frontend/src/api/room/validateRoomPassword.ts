import api from '../api';
import { isAxiosError } from 'axios';

const validateRoomPassword = async (
    roomId: string,
    password: string,
    setError: React.Dispatch<React.SetStateAction<string | null>>
): Promise<boolean> => {
    try {
        const response = await api.post(`/room/${roomId}/validate-password`, {
            password
        });
        console.log('Password validation response:', response.data);
        return response.data.success;
    } catch (error) {
        if (isAxiosError(error) && error.response?.data.error) {
            setError(error.response.data.error);
            return false;
        }
        console.error('Error validating room password:', error);
        throw error;
    }
};

export default validateRoomPassword;
