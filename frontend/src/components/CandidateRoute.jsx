import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CandidateRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Chargement...</div>; 

    if (!user || user.role !== 'candidate') {
        return <Navigate to="/" replace />; 
    }

    return <Outlet />;
};

export default CandidateRoute;