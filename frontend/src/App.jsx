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
import ManageJobPage from './pages/recruiter/ManageJobPage'; // <-- ajouté
import CandidateRoute from './components/CandidateRoute';   // <-- ajouté
import MyApplicationsPage from './pages/candidate/MyApplicationsPage'; // <-- ajouté

// La page d'accueil reste la même
function HomePage() {
  return <div><h1>Bienvenue sur Get_Job !</h1></div>;
}

function App() {
  const { user, logout } = useContext(AuthContext);
  
  const handleLogout = () => {
    logout();
  };

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Get_Job</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {user ? (
                <>
                  <li className="nav-item">
                    <span className="nav-link">Bonjour, {user.name}</span>
                  </li>

                  {/* Lien vers tableau de bord général */}
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">Tableau de bord</Link>
                  </li>

                  {/* Lien pour les candidats connectés */}
                  {user.role === 'candidate' && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/my-applications">Mes Candidatures</Link>
                    </li>
                  )}

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
          <Route path="/jobs" element={<JobsListPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />

          {/* Routes protégées */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
