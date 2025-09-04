import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import apiClient from '../services/apiClient';

// Création du contexte
export const AuthContext = createContext(null);

// Création du fournisseur de contexte (le Provider)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true); // Pour savoir si on a fini de vérifier l'état initial

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            // On ajoute le token à l'en-tête de toutes les futures requêtes axios
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
        setLoading(false); // La vérification initiale est terminée
    }, []);

    const login = async (credentials) => {
        const data = await AuthService.login(credentials);
        setUser(data.user);
        setToken(data.access_token);
         // On ajoute le token à l'en-tête pour les sessions courantes et futures
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
        return data;
    };

    const register = (data) => {
        return AuthService.register(data);
    };

    const logout = async () => {
        await AuthService.logout(); // Appel de la fonction mise à jour
        setUser(null);
        setToken(null);
        delete apiClient.defaults.headers.common['Authorization'];
    };

    const authContextValue = {
        user,
        token,
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};