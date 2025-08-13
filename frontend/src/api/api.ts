import axios from 'axios';
export const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
api.defaults.withCredentials = true;
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
