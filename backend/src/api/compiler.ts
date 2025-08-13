import axios from 'axios';

/* const API_URL = 'https://localhost:2358'; */
/* const API_KEY = 'Zd3yEYt7zyK8CAaB7NURLJCXV6X2TMCS'; */

/* const compiler = axios.create({
    baseURL: API_URL,
    headers: {
        'X-Auth-Token': API_KEY,
        'Content-Type': 'application/json',
    },
}); */

const API_URL = 'https://judge0-ce.p.rapidapi.com';
const API_KEY = '5ed6999a95mshf46c86df3d7e6e1p148baejsn257432a44a8b';
const compiler = axios.create({
    baseURL: API_URL,
    headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
    }
});

export default compiler;
