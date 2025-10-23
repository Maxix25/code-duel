import api from '../api';

const getAvatar = async (playerId: string) => {
    return api.get(`/profile/avatar/${playerId}`, {
        responseType: 'blob'
    });
};

export default getAvatar;
