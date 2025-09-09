import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Chargement de la session...</div>; 
    }

    // Redirige si non connecté OU si l'utilisateur n'est pas un admin
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />; // Redirige à l'accueil
    }

    return <Outlet />; // Si c'est un admin, affiche le contenu demandé
};

export default AdminRoute;