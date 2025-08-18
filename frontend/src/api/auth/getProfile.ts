import api from '../api';

interface UserProfile {
    id: string;
    username: string;
    email: string;
}
const getProfile = async (): Promise<UserProfile> => {
    try {
        const response = await api.get('/auth/profile');
        return response.data.player;
    } catch (error) {
        console.error('Error getting profile:', error);
        throw error;
    }
};

export default getProfile;
