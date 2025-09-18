import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import AdminService from '../../services/AdminService';

// Enregistrement des composants Chart.js nécessaires
ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AdminService.getDashboardStats()
      .then(response => {
        setStats(response.data);
      })
      .catch(error => console.error("Erreur de chargement des stats", error))
      .finally(() => setLoading(false));
  }, []);

  // Spinner de chargement élégant
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }} role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (!stats) return <p className="text-center text-danger mt-5">⚠️ Impossible de charger les statistiques.</p>;

  // Préparation des données pour le Pie Chart
  const pieChartData = {
    labels: stats.role_distribution.map(item => item.role),
    datasets: [{
      label: '# d\'utilisateurs',
      data: stats.role_distribution.map(item => item.total),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['#FF4C6D', '#2694E8', '#FFB800'],
    }]
  };

  // Préparation des données pour le Bar Chart
  const barChartData = {
    labels: ['Nouveautés (30 jours)'],
    datasets: [
      {
        label: 'Nouvelles Candidatures',
        data: [stats.activity_last_30_days.new_applications],
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderRadius: 6,
      },
      {
        label: 'Nouvelles Offres',
        data: [stats.activity_last_30_days.new_jobs],
        backgroundColor: 'rgba(153, 102, 255, 0.8)',
        borderRadius: 6,
      }
    ]
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center"> Tableau de Bord Administrateur</h1>

      {/* Chiffres clés */}
      <div className="row mb-4 g-3">
        <div className="col-md-4">
          <div className="card text-white bg-primary shadow-sm rounded-3 h-100 hover-card">
            <div className="card-body text-center">
              <h5 className="card-title">Utilisateurs</h5>
              <p className="card-text fs-2 fw-bold">{stats.key_figures.total_users}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success shadow-sm rounded-3 h-100 hover-card">
            <div className="card-body text-center">
              <h5 className="card-title">Offres d'Emploi</h5>
              <p className="card-text fs-2 fw-bold">{stats.key_figures.total_jobs}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-info shadow-sm rounded-3 h-100 hover-card">
            <div className="card-body text-center">
              <h5 className="card-title">Candidatures</h5>
              <p className="card-text fs-2 fw-bold">{stats.key_figures.total_applications}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm rounded-3">
            <div className="card-body">
              <h5 className="card-title text-center mb-3">Répartition des Rôles</h5>
              <Pie data={pieChartData} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm rounded-3">
            <div className="card-body">
              <h5 className="card-title text-center mb-3">Activité (30 derniers jours)</h5>
              <Bar data={barChartData} />
            </div>
          </div>
        </div>
      </div>

      {/* Style custom hover */}
      <style>{`
        .hover-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0px 6px 20px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardPage;
