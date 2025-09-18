import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import des LAYOUTS
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import ChatLayout from './components/layout/ChatLayout'; // C'est lui qu'on va utiliser

// Import des pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import JobsListPage from './pages/JobsListPage';
import JobDetailPage from './pages/JobDetailPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import DashboardRecruiterPage from './pages/recruiter/DashboardRecruiterPage';
import CreateJobPage from './pages/recruiter/CreateJobPage';
import ManageJobPage from './pages/recruiter/ManageJobPage';
import MyApplicationsPage from './pages/candidate/MyApplicationsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ManageJobsPage from './pages/admin/ManageJobsPage';

// Import des gardes de route
import ProtectedRoute from './components/ProtectedRoute';
import RecruiterRoute from './components/RecruiterRoute';
import CandidateRoute from './components/CandidateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* GROUPE 1: Routes d'Authentification (sans layout principal) */}
        <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* --- LA CORRECTION EST ICI --- */}
        {/* GROUPE 2: Route du Chat (utilise son propre layout plein écran) */}
        <Route element={<ChatLayout />}>
          <Route element={<ProtectedRoute />}>
              <Route path="/chat" element={<ChatPage />} />
          </Route>
        </Route>
        
        {/* GROUPE 3: Routes de l'application principale (utilisent le layout standard avec conteneur) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<JobsListPage />} />
          <Route path="/jobs" element={<JobsListPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />

          {/* Routes protégées génériques */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* On a déplacé /chat vers son propre layout */}
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

          {/* Routes ADMIN */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<ManageUsersPage />} />
            <Route path="/admin/jobs" element={<ManageJobsPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;