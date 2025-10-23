import api from '../api';

const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    return api.post('/profile/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export default uploadAvatar;
