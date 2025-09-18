import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div>
            {/* En-tête simple, fixe en haut */}
            <header style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 10
            }}>
                <Link className="navbar-brand" to="/" style={{ color: '#333', fontWeight: 'bold' }}>
                    Get_Job
                </Link>
                <div >
                    <Link to="/login" className="btn btn-light me-2">Connexion</Link>
                    <Link to="/register" className="btn btn-outline-light bg-danger">Inscription</Link>
                </div>
            </header>

            {/* La balise Outlet va afficher le contenu de la page actuelle (LoginPage, RegisterPage, etc.) */}
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default AuthLayout;