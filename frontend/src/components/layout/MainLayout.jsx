import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
    const location = useLocation();

    // La liste définitive des pages qui ne sont pas dans un <div class="container">
    const fullWidthPages = [
        '/',
        '/jobs',
        '/recruiter/jobs/create',
        '/recruiter/dashboard', // <-- ON AJOUTE LE DASHBOARD RECRUTEUR
        '/my-applications',
        '/admin/dashboard',
        '/admin/users',
        '/admin/jobs',
    ];

    // Conditions complexes pour gérer les URLs avec des ID dynamiques
    const isFullWidth = 
        fullWidthPages.includes(location.pathname) ||
        (location.pathname.startsWith('/recruiter/jobs/') && location.pathname.endsWith('/manage'));

    return (
        <>
            <Navbar />
            {isFullWidth ? (
                // Pour les pages plein écran
                <main>
                    <Outlet />
                </main>
            ) : (
                // Pour toutes les autres pages
                <main className="container mt-4">
                    <Outlet /> 
                </main>
            )}
        </>
    );
};

export default MainLayout;