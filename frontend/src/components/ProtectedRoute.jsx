import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        // Optionnel: afficher un spinner ou un message de chargement
        return <div>Chargement...</div>; 
    }

    // Si la vérification est terminée et qu'il n'y a pas d'utilisateur,
    // on redirige vers la page de connexion.
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Si l'utilisateur est bien connecté, on affiche le contenu de la page demandée.
    return <Outlet />;
};

export default ProtectedRoute;