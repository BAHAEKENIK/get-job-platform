import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage'; // Importer la page
import ProtectedRoute from './components/ProtectedRoute'; // Importer le composant de protection
import { AuthContext } from './context/AuthContext'; 
import JobsListPage from './pages/JobsListPage'; // 1. Importer la page liste
import JobDetailPage from './pages/JobDetailPage'; // 2. Importer la page détail// Importer le contexte
import RecruiterRoute from './components/RecruiterRoute';
import DashboardRecruiterPage from './pages/recruiter/DashboardRecruiterPage';
import CreateJobPage from './pages/recruiter/CreateJobPage';
// La page d'accueil reste la même
function HomePage() { return <div><h1>Bienvenue sur Get_Job !</h1></div>; }

function App() {
  const { user, logout } = useContext(AuthContext);
  
  const handleLogout = () => {
    logout();
    // Optionnel : rediriger l'utilisateur après la déconnexion
  };

  return (
    <Router>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Get_Job</Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                {user ? (
                  // Si l'utilisateur est connecté
                  <>
                    <li className="nav-item">
                       <span className="nav-link">Bonjour, {user.name}</span>
                    </li>
                     <li className="nav-item">
                       <Link className="nav-link" to="/dashboard">Tableau de bord</Link>
                    </li>
                    <li className="nav-item">
                      <button className="btn btn-link nav-link" onClick={handleLogout}>Déconnexion</button>
                    </li>
                  </>
                ) : (
                  // Si l'utilisateur N'EST PAS connecté
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">Connexion</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/register">Inscription</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>

        <div className="container mt-4">
          <Routes>
            {/* Routes Publiques */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/jobs" element={<JobsListPage />} />      {/* 4. Ajouter la route pour la liste */}
            <Route path="/jobs/:id" element={<JobDetailPage />} /> {/* 5. Ajouter la route pour les détails */}
            {/* Routes Protégées */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                {/* Ajoutez ici toutes vos autres routes protégées */}
            </Route>
            <Route element={<RecruiterRoute />}>
                <Route path="/recruiter/dashboard" element={<DashboardRecruiterPage />} />
                <Route path="/recruiter/jobs/create" element={<CreateJobPage />} />
                {/* La route pour l'édition sera ajoutée ici */}
            </Route>
          </Routes>
        </div>
    </Router>
  );
}

export default App;