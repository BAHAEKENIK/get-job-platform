import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RecruiterRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Chargement...</div>; 
    }

    // Redirige si non connecté OU si l'utilisateur n'est pas un recruteur
    if (!user || user.role !== 'recruiter') {
        return <Navigate to="/" replace />; // Redirige à l'accueil
    }

    return <Outlet />;
};

export default RecruiterRoute;