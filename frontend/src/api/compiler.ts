import axios from 'axios';

const API_URL = 'https://judge0-ce.p.rapidapi.com';
const API_KEY = '5ed6999a95mshf46c86df3d7e6e1p148baejsn257432a44a8b';

export const LANGUAGES: Record<string, { id: number; monaco: string }> = {
    python: { id: 71, monaco: 'python' },
    javascript: { id: 63, monaco: 'javascript' },
    // java: { id: 62, monaco: 'java' },
    // cpp: { id: 54, monaco: 'cpp' },
};

const compiler = axios.create({
    baseURL: API_URL,
    headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json',
    },
});

export default compiler;
