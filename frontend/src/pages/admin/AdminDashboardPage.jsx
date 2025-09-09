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

    if (loading) return <p>Chargement des statistiques...</p>;
    if (!stats) return <p>Impossible de charger les statistiques.</p>;

    // Préparation des données pour le diagramme en camembert (Pie Chart)
    const pieChartData = {
        labels: stats.role_distribution.map(item => item.role),
        datasets: [{
            label: '# d\'utilisateurs',
            data: stats.role_distribution.map(item => item.total),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        }]
    };

    // Préparation des données pour le diagramme en barres (Bar Chart)
    const barChartData = {
        labels: ['Nouveautés (30 jours)'],
        datasets: [
            {
                label: 'Nouvelles Candidatures',
                data: [stats.activity_last_30_days.new_applications],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Nouvelles Offres',
                data: [stats.activity_last_30_days.new_jobs],
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
            }
        ]
    };

    return (
        <div className="container">
            <h1 className="mb-4">Tableau de Bord Administrateur</h1>

            {/* Chiffres clés */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card text-white bg-primary">
                        <div className="card-body">
                            <h5 className="card-title">Utilisateurs</h5>
                            <p className="card-text fs-2">{stats.key_figures.total_users}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-success">
                         <div className="card-body">
                            <h5 className="card-title">Offres d'Emploi</h5>
                            <p className="card-text fs-2">{stats.key_figures.total_jobs}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                     <div className="card text-white bg-info">
                        <div className="card-body">
                            <h5 className="card-title">Candidatures</h5>
                            <p className="card-text fs-2">{stats.key_figures.total_applications}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Graphiques */}
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Répartition des Rôles</h5>
                            <Pie data={pieChartData} />
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                     <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Activité (30 derniers jours)</h5>
                            <Bar data={barChartData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;