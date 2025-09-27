import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
    FaBriefcase, FaComments, FaBell, FaUserCircle,
    FaSignOutAlt, FaListAlt, FaUserShield, FaPlusCircle,
    FaUsers, FaCog, FaThList
} from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, notifications } = useContext(AuthContext);

    const handleLogout = () => { logout(); };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm" style={{ padding: '0.75rem 1.5rem' }}>
            <div className="container-fluid">
                
                {/* --- Logo --- */}
                <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
                    <FaBriefcase className="me-2" style={{ color: '#0d6efd' }} />
                    <span>Get_Job</span>
                </Link>

                {/* --- Bouton hamburger mobile --- */}
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#mainNavbarContent" 
                    aria-controls="mainNavbarContent" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                {/* --- Contenu collapsible --- */}
                <div className="collapse navbar-collapse" id="mainNavbarContent">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/jobs">
                                <FaThList className="d-lg-none me-2"/> 
                                Offres d'emploi
                            </NavLink>
                        </li>
                    </ul>

                    {/* --- Section droite --- */}
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                        {user ? (
                            <>
                                {/* Liens spécifiques aux rôles */}
                                {user.role === 'recruiter' && (
                                    <li className="nav-item" data-tooltip="Mes Offres">
                                        <NavLink className="nav-link fs-5 mx-1" to="/recruiter/dashboard">
                                            <FaPlusCircle />
                                            <span className="d-lg-none ms-2">Mes Offres</span>
                                        </NavLink>
                                    </li>
                                )}
                                {user.role === 'candidate' && (
                                    <li className="nav-item" data-tooltip="Mes Candidatures">
                                        <NavLink className="nav-link fs-5 mx-1" to="/my-applications">
                                            <FaListAlt />
                                            <span className="d-lg-none ms-2">Mes Candidatures</span>
                                        </NavLink>
                                    </li>
                                )}
                                <li className="nav-item" data-tooltip="Messagerie">
                                    <NavLink className="nav-link fs-5 mx-1" to="/chat">
                                        <FaComments />
                                        <span className="d-lg-none ms-2">Messagerie</span>
                                    </NavLink>
                                </li>

                                {/* Notifications */}
                                <li className="nav-item dropdown" data-tooltip="Notifications">
                                    <a className="nav-link fs-5 mx-1" href="#" role="button" data-bs-toggle="dropdown">
                                        <span className="position-relative d-inline-flex">
                                            <FaBell />
                                            {notifications?.length > 0 && (
                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.55em', padding: '0.3em' }}>
                                                    {notifications.length}
                                                </span>
                                            )}
                                        </span>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2" style={{ minWidth: '350px' }}>
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

                                {/* Menu utilisateur */}
                                <li className="nav-item dropdown" data-tooltip="Mon Compte">
                                    <a className="nav-link fs-5 mx-1" href="#" role="button" data-bs-toggle="dropdown">
                                        <FaUserCircle />
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                                        <li className="px-3 py-2">
                                            <div className="fw-bold">{user.name}</div>
                                            <div className="small text-muted">{user.email}</div>
                                        </li>
                                        <li><hr className="dropdown-divider"/></li>

                                        {user.role === 'admin' && (
                                            <>
                                                <li><Link className="dropdown-item" to="/admin/dashboard"><FaUserShield className="me-2" /> Dashboard Admin</Link></li>
                                                <li><Link className="dropdown-item" to="/admin/users"><FaUsers className="me-2" /> Gérer Utilisateurs</Link></li>
                                                <li><Link className="dropdown-item" to="/admin/jobs"><FaCog className="me-2" /> Gérer Offres</Link></li>
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
                            <>
                                <li className="nav-item my-1 my-lg-0">
                                    <Link className="btn btn-outline-primary me-2 w-100" to="/login">Connexion</Link>
                                </li>
                                <li className="nav-item my-1 my-lg-0">
                                    <Link className="btn btn-primary w-100" to="/register">Inscription</Link>
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
