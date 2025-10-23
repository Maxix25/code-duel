import api from '../api';

const getPlayerProfile = async (playerId: string) => {
    return api.get(`/profile/${playerId}`);
};

export default getPlayerProfile;
