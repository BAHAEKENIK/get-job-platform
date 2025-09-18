import apiClient from './apiClient';

const AdminService = {
    // === DASHBOARD ===
    getDashboardStats: () => {
        return apiClient.get('/admin/dashboard-stats');
    },

    // === GESTION DES UTILISATEURS ===
    getAllUsers: (params) => {
        return apiClient.get('/admin/users', { params });
    },
    updateUser: (userId, data) => {
        return apiClient.put(`/admin/users/${userId}`, data);
    },
    deleteUser: (userId) => {
        return apiClient.delete(`/admin/users/${userId}`);
    },

    // --- SECTION POUR LES JOBS AJOUTÉE ---
    /**
     * Récupère TOUTES les offres pour le panel admin.
     * @param {object} params - Paramètres de la requête (page, search).
     * @returns {Promise}
     */
    getAllJobs: (params) => {
        return apiClient.get('/admin/jobs', { params });
    },
    
    /**
     * Un admin peut supprimer n'importe quelle offre.
     * Note: On utilise la route existante DELETE /api/jobs/{id}.
     * Le JobController vérifie déjà si l'utilisateur est un admin.
     * @param {number|string} jobId
     * @returns {Promise}
     */
    deleteJob: (jobId) => {
        return apiClient.delete(`/jobs/${jobId}`);
    }
};

export default AdminService;