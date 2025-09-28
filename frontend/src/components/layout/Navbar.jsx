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

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm" style={{ padding: '0.75rem 1.5rem' }}>
            <div className="container-fluid">
                {/* Logo */}
                <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
                    <FaBriefcase className="me-2" style={{ color: '#0d6efd' }} />
                    <span>Get_Job</span>
                </Link>

                {/* Bouton Burger pour le Mobile */}
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
                            <NavLink className="nav-link" to="/jobs">
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
                                    <li className="nav-item">
                                        <NavLink className="nav-link nav-link-icon-text" to="/recruiter/dashboard">
                                            <FaPlusCircle className="nav-icon" />
                                            <span className="nav-text">Mes Offres</span>
                                        </NavLink>
                                    </li>
                                )}
                                {user.role === 'candidate' && (
                                    <li className="nav-item">
                                        <NavLink className="nav-link nav-link-icon-text" to="/my-applications">
                                            <FaListAlt className="nav-icon" />
                                            <span className="nav-text">Mes Candidatures</span>
                                        </NavLink>
                                    </li>
                                )}

                                {/* Messagerie */}
                                <li className="nav-item">
                                    <NavLink className="nav-link nav-link-icon-text" to="/chat">
                                        <FaComments className="nav-icon" />
                                        <span className="nav-text">Messagerie</span>
                                    </NavLink>
                                </li>
                                
                                {/* Notifications */}
                                <li className="nav-item dropdown">
                                    <a className="nav-link nav-link-icon-text" href="#" role="button" data-bs-toggle="dropdown">
                                        <span className="position-relative d-inline-flex">
                                            <FaBell className="nav-icon" />
                                            {notifications?.length > 0 && (
                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                    {notifications.length}
                                                </span>
                                            )}
                                        </span>
                                        <span className="nav-text">Notifications</span>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                                        <li className="px-3 py-2 fw-bold">Notifications</li>
                                        <li><hr className="dropdown-divider my-0" /></li>
                                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                            {notifications?.length > 0 ? (
                                                notifications.map(notif => (
                                                    <li key={notif.id}><Link to={notif.data.action_url} className="dropdown-item py-2 small">{notif.data.message}</Link></li>
                                                ))
                                            ) : ( 
                                                <li><span className="dropdown-item-text text-muted text-center py-4">Aucune nouvelle notification</span></li>
                                            )}
                                        </div>
                                    </ul>
                                </li>
                                
                                {/* Menu Utilisateur / Admin */}
                                <li className="nav-item dropdown">
                                    <a className="nav-link nav-link-icon-text" href="#" role="button" data-bs-toggle="dropdown">
                                        <FaUserCircle className="nav-icon" />
                                        <span className="nav-text">Mon Compte</span>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                                         <li className="px-3 py-2">
                                            <div className="fw-bold">{user.name}</div>
                                            <div className="small text-muted">{user.email}</div>
                                        </li>
                                        <li><hr className="dropdown-divider"/></li>
                                        {user.role === 'admin' && (
                                            <>
                                                <li><Link className="dropdown-item" to="/admin/dashboard"><FaUserShield className="me-2" /> Espace Admin</Link></li>
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
                             // --- VUE UTILISATEUR NON CONNECTÉ ---
                            <>
                                <li className="nav-item"><Link className="btn btn-outline-primary me-2" to="/login">Connexion</Link></li>
                                <li className="nav-item"><Link className="btn btn-primary" to="/register">Inscription</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;