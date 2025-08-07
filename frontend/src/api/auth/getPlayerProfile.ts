import api from '../api';

const getPlayerProfile = async (playerId: string) => {
    return api.get(`/auth/profile/${playerId}`);
};

export default getPlayerProfile;
