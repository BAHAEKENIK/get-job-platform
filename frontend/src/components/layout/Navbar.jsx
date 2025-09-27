import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
    FaBriefcase, FaComments, FaBell, FaUserCircle, FaSignOutAlt, FaListAlt, FaUserShield, FaPlusCircle, FaUsers, FaCog
} from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, notifications } = useContext(AuthContext);

    const handleLogout = () => { logout(); };

    // Une fonction pour fermer le menu hamburger après un clic sur mobile
    const closeMobileMenu = () => {
        const navbarCollapse = document.getElementById('navbarContent');
        if (navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm" style={{ padding: '0.75rem 1.5rem' }}>
            <div className="container-fluid">
                {/* Logo */}
                <Link className="navbar-brand fw-bold d-flex align-items-center" to="/" onClick={closeMobileMenu}>
                    <FaBriefcase className="me-2" style={{ color: '#0d6efd' }} />
                    <span>Get_Job</span>
                </Link>

                {/* --- BOUTON HAMBURGER POUR MOBILE --- */}
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarContent" 
                    aria-controls="navbarContent" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* --- CONTENU DU MENU (QUI SE PLIE SUR MOBILE) --- */}
                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/jobs" onClick={closeMobileMenu}>
                                Offres d'emploi
                            </NavLink>
                        </li>
                    </ul>

                    {/* Section droite */}
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
                        {user ? (
                            // --- VUE UTILISATEUR CONNECTÉ ---
                            <>
                                {user.role === 'recruiter' && (
                                    <li className="nav-item" data-tooltip="Mes Offres">
                                        <NavLink className="nav-link fs-5 mx-lg-1" to="/recruiter/dashboard" onClick={closeMobileMenu}>
                                            <FaPlusCircle />
                                            <span className="d-lg-none ms-2">Mes Offres</span>
                                        </NavLink>
                                    </li>
                                )}
                                {user.role === 'candidate' && (
                                    <li className="nav-item" data-tooltip="Mes Candidatures">
                                        <NavLink className="nav-link fs-5 mx-lg-1" to="/my-applications" onClick={closeMobileMenu}>
                                            <FaListAlt />
                                            <span className="d-lg-none ms-2">Mes Candidatures</span>
                                        </NavLink>
                                    </li>
                                )}

                                {/* Messagerie */}
                                <li className="nav-item" data-tooltip="Messagerie">
                                    <NavLink className="nav-link fs-5 mx-lg-1" to="/chat" onClick={closeMobileMenu}>
                                        <FaComments />
                                        <span className="d-lg-none ms-2">Messagerie</span>
                                    </NavLink>
                                </li>
                                
                                {/* Notifications */}
                                <li className="nav-item dropdown" data-tooltip="Notifications">
                                    <a className="nav-link fs-5 mx-lg-1" href="#" role="button" data-bs-toggle="dropdown">
                                        <span className="position-relative d-inline-flex">
                                            <FaBell />
                                            {notifications?.length > 0 && (
                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.55em', padding: '0.3em' }}>
                                                    {notifications.length}
                                                </span>
                                            )}
                                        </span>
                                        <span className="d-lg-none ms-2">Notifications</span>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                                       {/* Contenu des notifications (inchangé) */}
                                    </ul>
                                </li>
                                
                                {/* Menu Utilisateur / Admin */}
                                <li className="nav-item dropdown" data-tooltip="Mon Compte">
                                    <a className="nav-link fs-5 mx-lg-1" href="#" role="button" data-bs-toggle="dropdown">
                                        <FaUserCircle />
                                        <span className="d-lg-none ms-2">Mon Compte</span>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                                         <li className="px-3 py-2">
                                            <div className="fw-bold">{user.name}</div>
                                            <div className="small text-muted">{user.email}</div>
                                        </li>
                                        <li><hr className="dropdown-divider"/></li>
                                        {user.role === 'admin' && (
                                            <>
                                                <li><Link className="dropdown-item" to="/admin/dashboard" onClick={closeMobileMenu}><FaUserShield className="me-2" /> Dashboard Admin</Link></li>
                                                <li><Link className="dropdown-item" to="/admin/users" onClick={closeMobileMenu}><FaUsers className="me-2" /> Gérer Utilisateurs</Link></li>
                                                <li><Link className="dropdown-item" to="/admin/jobs" onClick={closeMobileMenu}><FaCog className="me-2" /> Gérer Offres</Link></li>
                                                <li><hr className="dropdown-divider"/></li>
                                            </>
                                        )}
                                        <li>
                                            <button className="dropdown-item text-danger" onClick={() => { handleLogout(); closeMobileMenu(); }}>
                                                <FaSignOutAlt className="me-2" /> Déconnexion
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            </>
                        ) : (
                            // --- VUE UTILISATEUR NON CONNECTÉ ---
                            <>
                                <li className="nav-item my-1 my-lg-0"><Link className="btn btn-outline-primary w-100" to="/login" onClick={closeMobileMenu}>Connexion</Link></li>
                                <li className="nav-item mt-2 mt-lg-0 ms-lg-2"><Link className="btn btn-primary w-100" to="/register" onClick={closeMobileMenu}>Inscription</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;