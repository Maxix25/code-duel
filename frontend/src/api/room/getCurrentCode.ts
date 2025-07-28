import api from '../api';

const getCurrentCode = async (roomId: string) => {
    const response = await api.get(`/room/${roomId}/code`);
    return response.data;
};

export default getCurrentCode;
