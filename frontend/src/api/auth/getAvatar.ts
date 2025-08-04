import api from '../api';

const getAvatar = async (playerId: string) => {
    return api.get(`/auth/avatar/${playerId}`, {
        responseType: 'blob'
    });
};

export default getAvatar;
