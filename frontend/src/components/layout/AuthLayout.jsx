import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaBriefcase } from 'react-icons/fa';

const AuthLayout = () => {
    // Le hook useLocation nous donne l'URL actuelle.
    const location = useLocation();

    // On regarde sur quelle page on se trouve.
    const isLoginPage = location.pathname === '/login';
    const isRegisterPage = location.pathname === '/register';

    return (
        <div>
            {/* --- HEADER AMÉLIORÉ POUR LE RESPONSIVE --- */}
            <header style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                padding: '1rem 1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 10
            }}>
                {/* Logo */}
                <Link className="navbar-brand fw-bold d-flex align-items-center" to="/" style={{ color: '#333' }}>
                    <FaBriefcase className="me-2" style={{ color: '#0d6efd' }} />
                    Get_Job
                </Link>
                
                {/* Boutons qui s'affichent/se cachent en fonction de la page */}
                <div >
                    {/* Le bouton Connexion est caché sur la page /login */}
                    {!isLoginPage && (
                        <Link to="/login" className="btn btn-light me-2">Connexion</Link>
                    )}
                    
                    {/* Le bouton Inscription est caché sur la page /register */}
                    {!isRegisterPage && (
                        <Link to="/register" className="btn btn-light">Inscription</Link>
                    )}
                </div>
            </header>
            
            {/* Le contenu de la page (LoginPage, RegisterPage...) sera affiché ici */}
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default AuthLayout;