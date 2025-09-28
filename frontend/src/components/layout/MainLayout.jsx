import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar'; // Importer le composant Navbar

// Ce composant est le "moule" pour toutes les pages standards de l'application.
// Il inclut la barre de navigation et décide si le contenu de la page
// doit être dans un conteneur centré ou prendre toute la largeur de l'écran.

const MainLayout = () => {
    // Le hook useLocation nous donne des informations sur l'URL actuelle.
    const location = useLocation();

    // On définit ici la liste de toutes les pages qui ont un design
    // "plein écran" et qui ne doivent pas être limitées par la classe "container" de Bootstrap.
    const fullWidthPages = [
        '/',
        '/jobs',
        '/recruiter/jobs/create',
        '/recruiter/dashboard',
        '/my-applications',
        '/admin/dashboard',
        '/admin/users',
        '/admin/jobs',
    ];

    // On crée une condition complexe pour les pages dont l'URL est dynamique,
    // comme "/recruiter/jobs/123/manage".
    const isDynamicFullWidth = 
        location.pathname.startsWith('/recruiter/jobs/') && location.pathname.endsWith('/manage');

    // La condition finale : si l'URL exacte est dans la liste OU si la condition dynamique est vraie.
    const isFullWidth = fullWidthPages.includes(location.pathname) || isDynamicFullWidth;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <Navbar />

            {/*
              On utilise un opérateur ternaire pour choisir le bon conteneur de page :
              - Si isFullWidth est vrai, on utilise un <main> simple.
              - Sinon, on utilise un <main> avec les classes "container mt-4" pour centrer
                le contenu et lui donner des marges (pour les pages comme le détail d'une offre).
            */}
            {isFullWidth ? (
                <main style={{ flex: 1 }}> {/* flex: 1 pour s'assurer que le main prend tout l'espace vertical restant */}
                    <Outlet />
                </main>
            ) : (
                <main className="container mt-4" style={{ flex: 1 }}>
                    <Outlet /> 
                </main>
            )}
        </div>
    );
};

export default MainLayout;