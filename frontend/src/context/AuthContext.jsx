import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import apiClient from '../services/apiClient';
import echo from '../services/echo';

// Création du contexte
export const AuthContext = createContext(null);

// Fournisseur de contexte
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    // 🔔 Notifications
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            const parsedUser = JSON.parse(storedUser);

            setUser(parsedUser);
            setToken(storedToken);

            // Token pour axios
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

            // Connexion Echo
            echo.connect();

            // 🔹 Écouter les notifications en temps réel
            echo.private(`App.Models.User.${parsedUser.id}`)
                .notification((notification) => {
                    setNotifications(prev => [notification, ...prev]);
                });
        }

        setLoading(false);

        // 🔹 Nettoyer les écouteurs à la destruction
        return () => {
            if (user) {
                echo.leave(`App.Models.User.${user.id}`);
            }
        };
    }, []);

    const login = async (credentials) => {
        const data = await AuthService.login(credentials);

        setUser(data.user);
        setToken(data.access_token);

        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.access_token);

        // Token axios
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;

        // Connexion Echo
        echo.connect();

        // 🔹 Écouter notifications après login
        echo.private(`App.Models.User.${data.user.id}`)
            .notification((notification) => {
                setNotifications(prev => [notification, ...prev]);
            });

        return data;
    };

    const register = (data) => {
        return AuthService.register(data);
    };

    const logout = async () => {
        echo.disconnect();
        await AuthService.logout();

        setUser(null);
        setToken(null);
        setNotifications([]);

        localStorage.removeItem('user');
        localStorage.removeItem('token');

        delete apiClient.defaults.headers.common['Authorization'];
    };

    const authContextValue = {
        user,
        token,
        loading,
        notifications,   // 🔔 notifications accessibles dans toute l’app
        setNotifications,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};
