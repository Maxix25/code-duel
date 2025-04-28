import axios from 'axios';

const API_URL = 'https://judge0-ce.p.rapidapi.com';
const API_KEY = '5ed6999a95mshf46c86df3d7e6e1p148baejsn257432a44a8b';

export const LANGUAGES = {
    python: 109,
    node: 102,
};

const compiler = axios.create({
    baseURL: API_URL,
    headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    },
});

export default compiler;
