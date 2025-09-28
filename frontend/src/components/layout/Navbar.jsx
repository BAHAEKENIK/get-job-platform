import React, { useContext, useRef, useEffect } from 'react';
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
    const navbarRef = useRef(null);

    const handleLogout = () => { 
        logout(); 
        closeNavbar();
    };

    const closeNavbar = () => {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (navbarToggler && navbarToggler.getAttribute('aria-expanded') === 'true') {
            navbarToggler.click();
        }
        
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
        }
    };

    // Fermer le navbar quand on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navbarRef.current && !navbarRef.current.contains(event.target)) {
                closeNavbar();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav ref={navbarRef} className="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top custom-navbar">
            <div className="container-fluid">
                {/* Logo */}
                <Link className="navbar-brand fw-bold d-flex align-items-center" to="/" onClick={closeNavbar}>
                    <FaBriefcase className="me-2 brand-icon" />
                    <span>Get_Job</span>
                </Link>

                {/* Bouton Burger */}
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
                    {/* Liens principaux */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/jobs" onClick={closeNavbar}>
                                Offres d'emploi
                            </NavLink>
                        </li>
                    </ul>

                    {/* Section droite */}
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                        {user ? (
                            // Utilisateur connecté
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
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" onClick={(e) => e.preventDefault()}>
                                        <FaBell className="me-1 d-lg-none" /> Notifications
                                        {notifications?.length > 0 && <span className="badge rounded-pill bg-danger ms-1">{notifications.length}</span>}
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                                        <li><span className="dropdown-item-text">Notifications</span></li>
                                    </ul>
                                </li>
                                <li className="nav-item dropdown mobile-full-width">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" onClick={(e) => e.preventDefault()}>
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
                                            <button className="dropdown-item text-danger" onClick={handleLogout}>
                                                <FaSignOutAlt className="me-2" /> Déconnexion
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            </>
                        ) : (
                            // Utilisateur non connecté
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