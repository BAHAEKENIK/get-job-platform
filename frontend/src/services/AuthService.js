import apiClient from './apiClient';

const AuthService = {
    register: (data) => {
        return apiClient.post('/register', data);
    },

    login: async (credentials) => {
        // C'est juste un appel direct. C'est le AuthContext qui gère le stockage.
        const response = await apiClient.post('/login', credentials);
        return response; // On renvoie la réponse complète
    },

    logout:()=>{
        return apiClient.post('/logout');
    },

    forgotPassword:(email)=>{
        return apiClient.post('/forgot-password', { email });
    },

    resetPassword: (data) => {
        return apiClient.post('/reset-password', data);
    },
};

export default AuthService;