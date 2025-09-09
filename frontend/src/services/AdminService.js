import apiClient from './apiClient';

const AdminService = {
    // Récupère les statistiques pour le tableau de bord
    getDashboardStats: () => {
        return apiClient.get('/admin/dashboard-stats');
    },

    // Les futures méthodes (getUsers, getJobs, etc.) viendront ici
};

export default AdminService;