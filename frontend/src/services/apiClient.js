import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // L'URL de votre API Laravel
    withCredentials: true, // Autorise l'envoi de cookies d'authentification
});

export default apiClient;