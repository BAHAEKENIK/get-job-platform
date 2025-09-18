import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import apiClient from '../services/apiClient';
import echo from '../services/echo';

const NotificationService = {
    getNotifications: () => apiClient.get('/notifications'),
};

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    
    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setToken(storedToken);
                setUser(parsedUser);

                // Configuration pour les requêtes authentifiées
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                echo.connect();

                // Récupération des notifications initiales
                NotificationService.getNotifications()
                    .then(res => setNotifications(res.data))
                    .catch(err => console.error("Échec chargement notifs", err));
                
                // Écoute des nouvelles notifications
                echo.private(`App.Models.User.${parsedUser.id}`)
                    .notification(notification => {
                        setNotifications(prev => [notification, ...prev]);
                    });
            }
            setLoading(false);
        };
        initializeAuth();
        
        return () => {
            if (user) {
                echo.leave(`App.Models.User.${user.id}`);
            }
        };
    }, []);

    const login = async (credentials) => {
        // Le service fait l'appel...
        const response = await AuthService.login(credentials);
        
        // ...et le contexte gère le résultat.
        const { data } = response;
        if (data.access_token && data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.access_token);
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;

            // Met à jour l'état de l'application
            setUser(data.user);
            setToken(data.access_token);

            // Relancer l'écoute des notifications
            // Cette ligne n'est techniquement pas nécessaire car le useEffect va se relancer,
            // mais c'est une bonne sécurité pour s'assurer que c'est immédiat.
            echo.private(`App.Models.User.${data.user.id}`)
                .notification(notification => {
                    setNotifications(prev => [notification, ...prev]);
                });
        }
        return response;
    };
    
    const logout = async () => {
        if(user) {
            echo.leave(`App.Models.User.${user.id}`);
        }
        await AuthService.logout();
        
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete apiClient.defaults.headers.common['Authorization'];
        
        setUser(null);
        setToken(null);
        setNotifications([]);
        echo.disconnect();
    };

    const register = (data) => AuthService.register(data);

    const authContextValue = {
        user, token, loading,
        notifications, setNotifications,
        login, register, logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};