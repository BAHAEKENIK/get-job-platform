import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://127.0.0.1:8000/api',
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ERR_NETWORK') {
            console.error('Network error - backend might be down');
        }
        return Promise.reject(error);
    }
);

export default apiClient;