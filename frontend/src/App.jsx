import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext'; 
import JobsListPage from './pages/JobsListPage';
import JobDetailPage from './pages/JobDetailPage';
import RecruiterRoute from './components/RecruiterRoute';
import DashboardRecruiterPage from './pages/recruiter/DashboardRecruiterPage';
import CreateJobPage from './pages/recruiter/CreateJobPage';
import ManageJobPage from './pages/recruiter/ManageJobPage';
import CandidateRoute from './components/CandidateRoute';
import MyApplicationsPage from './pages/candidate/MyApplicationsPage';
import ChatPage from './pages/ChatPage';

// --- NOUVELLES IMPORTATIONS ADMIN ---
import AdminRoute from './components/AdminRoute';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ManageJobsPage from './pages/admin/ManageJobsPage';

// --- IMPORTATIONS MOT DE PASSE ---
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// La page d'accueil reste la même
function HomePage() {
  return <div><h1>Bienvenue sur Get_Job !</h1></div>;
}

function App() {
  const { user, logout, notifications } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Get_Job</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
              {user ? (
                <>
                  <li className="nav-item">
                    <span className="nav-link">Bonjour, {user.name}</span>
                  </li>

                  {/* Tableau de bord */}
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">Tableau de bord</Link>
                  </li>

                  {/* Messagerie */}
                  <li className="nav-item">
                    <Link className="nav-link" to="/chat">Messagerie</Link>
                  </li>

                  {/* 🔔 Notifications */}
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Cloche
                      {notifications && notifications.length > 0 && (
                        <span className="badge rounded-pill bg-danger ms-1">
                          {notifications.length}
                        </span>
                      )}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end" style={{ minWidth: '300px' }}>
                      {notifications && notifications.length > 0 ? (
                        notifications.map(notif => (
                          <li key={notif.id}>
                            <Link to={notif.data.action_url} className="dropdown-item">
                              {notif.data.message}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li>
                          <span className="dropdown-item-text">Aucune nouvelle notification</span>
                        </li>
                      )}
                    </ul>
                  </li>

                  {/* Liens spécifiques aux candidats */}
                  {user.role === 'candidate' && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/my-applications">Mes Candidatures</Link>
                    </li>
                  )}

                  {/* LIEN ADMIN */}
                  {user.role === 'admin' && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/dashboard">Admin</Link>
                    </li>
                  )}

                  {/* Déconnexion */}
                  <li className="nav-item">
                    <button className="btn btn-link nav-link" onClick={handleLogout}>
                      Déconnexion
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Connexion</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Inscription</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/forgot-password">Mot de passe oublié</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/jobs" element={<JobsListPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />

          {/* Routes protégées */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Route>

          {/* Routes recruteur */}
          <Route element={<RecruiterRoute />}>
            <Route path="/recruiter/dashboard" element={<DashboardRecruiterPage />} />
            <Route path="/recruiter/jobs/create" element={<CreateJobPage />} />
            <Route path="/recruiter/jobs/:id/manage" element={<ManageJobPage />} />
          </Route>

          {/* Routes candidat */}
          <Route element={<CandidateRoute />}>
            <Route path="/my-applications" element={<MyApplicationsPage />} />
          </Route>

          {/* --- NOUVELLES ROUTES ADMIN --- */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            {/* Préparées pour la suite */}
            {/* <Route path="/admin/users" element={<ManageUsersPage />} /> */}
            {/* <Route path="/admin/jobs" element={<ManageJobsPage />} /> */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
