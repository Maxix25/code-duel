import api from '../api';

const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    return api.put('/auth/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export default uploadAvatar;
