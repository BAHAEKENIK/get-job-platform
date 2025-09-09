import apiClient from './apiClient';

const AuthService = {
    register: (data) => {
        return apiClient.post('/register', data);
    },

    login: async (credentials) => {
        // Note: Sanctum setup is often handled by default with withCredentials,
        // but if needed, a call to /sanctum/csrf-cookie can be placed here.
        
        const response = await apiClient.post('/login', credentials);
        if (response.data.access_token) {
            // Stocke le token et les informations de l'utilisateur
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.access_token);
        }
        return response.data;
    },

    logout:()=>{
        apiClient.post('/logout');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    },
    forgotPassword:(email)=>{
        return apiClient.post('/forgot-password', { email });
    },
    resetPassword: (data) => {
        return apiClient.post('/reset-password', data);
    },
};

export default AuthService;