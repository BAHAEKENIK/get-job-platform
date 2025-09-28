import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
    FaBriefcase,
    FaComments,
    FaBell,
    FaUserCircle,
    FaSignOutAlt,
    FaListAlt,
    FaUserShield,
    FaPlusCircle,
    FaUsers,
    FaCog
} from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, notifications } = useContext(AuthContext);
    const handleLogout = () => { logout(); };

    // Une petite fonction pour fermer le menu burger après un clic sur un lien (sur mobile)
    const closeNavbar = () => {
        const navbarToggler = document.querySelector('.navbar-toggler');
        if (navbarToggler.getAttribute('aria-expanded') === 'true') {
            navbarToggler.click();
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top" style={{ padding: '0.75rem 1.5rem' }}>
            <div className="container-fluid">
                {/* Logo */}
                <Link className="navbar-brand fw-bold d-flex align-items-center" to="/" onClick={closeNavbar}>
                    <FaBriefcase className="me-2" style={{ color: '#0d6efd' }} />
                    <span>Get_Job</span>
                </Link>

                {/* --- Bouton Burger pour Mobile/Tablette --- */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavbar"
                    aria-controls="mainNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className="collapse navbar-collapse" id="mainNavbar">
                    {/* Liens principaux (à gauche sur grand écran) */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/jobs" onClick={closeNavbar}>
                                Offres d'emploi
                            </NavLink>
                        </li>
                    </ul>

                    {/* Section droite (se replie dans le burger sur mobile) */}
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                        {user ? (
                            // --- VUE UTILISATEUR CONNECTÉ ---
                            <>
                                {user.role === 'recruiter' && (
                                    <li className="nav-item mobile-full-width">
                                        <NavLink className="nav-link" to="/recruiter/dashboard" onClick={closeNavbar}>
                                            <FaPlusCircle className="me-1 d-lg-none" /> Mes Offres
                                        </NavLink>
                                    </li>
                                )}
                                {user.role === 'candidate' && (
                                    <li className="nav-item mobile-full-width">
                                        <NavLink className="nav-link" to="/my-applications" onClick={closeNavbar}>
                                            <FaListAlt className="me-1 d-lg-none" /> Mes Candidatures
                                        </NavLink>
                                    </li>
                                )}
                                <li className="nav-item mobile-full-width">
                                    <NavLink className="nav-link" to="/chat" onClick={closeNavbar}>
                                        <FaComments className="me-1 d-lg-none" /> Messagerie
                                    </NavLink>
                                </li>
                                <li className="nav-item dropdown mobile-full-width">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                        <FaBell className="me-1 d-lg-none" /> Notifications
                                        {notifications?.length > 0 && <span className="badge rounded-pill bg-danger ms-1">{notifications.length}</span>}
                                    </a>
                                    {/* ... menu déroulant notifications ... */}
                                </li>
                                <li className="nav-item dropdown mobile-full-width">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                        <FaUserCircle className="me-1 d-lg-none" /> {user.name}
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                                        {user.role === 'admin' && (
                                            <>
                                                <li><Link className="dropdown-item" to="/admin/dashboard" onClick={closeNavbar}><FaUserShield className="me-2"/>Dashboard</Link></li>
                                                <li><Link className="dropdown-item" to="/admin/users" onClick={closeNavbar}><FaUsers className="me-2"/>Utilisateurs</Link></li>
                                                <li><Link className="dropdown-item" to="/admin/jobs" onClick={closeNavbar}><FaCog className="me-2"/>Offres</Link></li>
                                                <li><hr className="dropdown-divider"/></li>
                                            </>
                                        )}
                                        <li>
                                            <button className="dropdown-item text-danger" onClick={() => { handleLogout(); closeNavbar(); }}>
                                                <FaSignOutAlt className="me-2" /> Déconnexion
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            </>
                        ) : (
                             // --- VUE UTILISATEUR NON CONNECTÉ ---
                            <>
                                <li className="nav-item mb-2 mb-lg-0">
                                    <Link className="btn btn-outline-primary w-100" to="/login" onClick={closeNavbar}>
                                        Connexion
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn btn-primary w-100" to="/register" onClick={closeNavbar}>
                                        Inscription
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;