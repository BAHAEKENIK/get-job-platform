import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AdminService from '../../services/AdminService';
import ChatService from '../../services/ChatService';
import { Modal } from 'bootstrap';
import styles from './ManageUsersPage.module.css';
import { FaEdit, FaTrashAlt, FaComments } from 'react-icons/fa';

const ManageUsersPage = () => {
    const [usersData, setUsersData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Filtres
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || '');

    // Modal
    const [editingUser, setEditingUser] = useState(null);
    const modalRef = useRef(null);
    const [bsModal, setBsModal] = useState(null);

    useEffect(() => {
        if (modalRef.current) {
            setBsModal(new Modal(modalRef.current));
        }
    }, []);

    // Fonction de chargement
    const fetchUsers = () => {
        setLoading(true);
        const params = Object.fromEntries(searchParams.entries());

        AdminService.getAllUsers(params)
            .then(response => setUsersData(response.data))
            .catch(error => console.error("Erreur de chargement des utilisateurs", error))
            .finally(() => setLoading(false));
    };

    useEffect(fetchUsers, [searchParams]);

    // Appliquer les filtres
    const handleFilterChange = () => {
        const newParams = { page: 1 };
        if (searchTerm) newParams.search = searchTerm;
        if (roleFilter) newParams.role = roleFilter;
        setSearchParams(newParams);
    };

    // Supprimer un utilisateur
    const handleDelete = async (userId) => {
        if (window.confirm("Supprimer cet utilisateur ? Cette action est irréversible.")) {
            try {
                await AdminService.deleteUser(userId);
                fetchUsers();
            } catch (error) {
                alert("Erreur lors de la suppression.");
            }
        }
    };

    // Ouvrir le modal d'édition
    const openEditModal = (user) => {
        setEditingUser({ ...user });
        if (bsModal) bsModal.show();
    };

    // Mettre à jour un utilisateur
    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await AdminService.updateUser(editingUser.id, {
                role: editingUser.role,
                is_active: editingUser.is_active,
            });
            fetchUsers();
            bsModal.hide();
        } catch (error) {
            alert("Erreur lors de la mise à jour.");
        }
    };

    // 🚀 Démarrer une conversation chat
    const handleStartChat = async (userId) => {
        try {
            const response = await ChatService.startConversation(userId);
            const newConversationId = response.data.data.id;
            navigate('/chat', { state: { newConversationId } });
        } catch (error) {
            console.error("Impossible de démarrer le chat:", error);
            alert("Erreur lors du démarrage de la conversation.");
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.contentCard}>
                <header className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Gestion des Utilisateurs</h1>
                    <span className="text-muted">{usersData ? usersData.meta.total : 0} utilisateurs</span>
                </header>

                {/* Filtres */}
                <div className="row g-3 mb-4 align-items-center">
                    <div className="col-md-5">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Rechercher par nom ou email..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4">
                        <select
                            className="form-select"
                            value={roleFilter}
                            onChange={e => setRoleFilter(e.target.value)}
                        >
                            <option value="">Tous les rôles</option>
                            <option value="candidate">Candidats</option>
                            <option value="recruiter">Recruteurs</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <button className="btn btn-primary w-100" onClick={handleFilterChange}>
                            Filtrer
                        </button>
                    </div>
                </div>

                {/* Tableau */}
                <div className="table-responsive">
                    <table className={`table table-hover ${styles.table}`}>
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Nom</th>
                                <th>Email</th>
                                <th>Rôle</th>
                                <th>Statut</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-5">
                                        <div className="spinner-border"></div>
                                    </td>
                                </tr>
                            ) : usersData?.data.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge ${user.role === 'admin'
                                            ? 'bg-danger'
                                            : user.role === 'recruiter'
                                                ? 'bg-info'
                                                : 'bg-secondary'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        {user.is_active
                                            ? <span className="badge bg-success">Actif</span>
                                            : <span className="badge bg-warning text-dark">Inactif</span>}
                                    </td>
                                    <td className="text-end">
                                        <button
                                            className="btn btn-sm btn-outline-success me-2"
                                            onClick={() => handleStartChat(user.id)}
                                            title="Contacter"
                                        >
                                            <FaComments />
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-primary me-2"
                                            onClick={() => openEditModal(user)}
                                            title="Modifier"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(user.id)}
                                            title="Supprimer"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (placeholder si nécessaire) */}
                {usersData && usersData.meta.last_page > 1 && (
                    <div className="mt-3">
                        {/* Votre code de pagination ici */}
                    </div>
                )}
            </div>

            {/* Modal de Modification */}
            <div className="modal fade" ref={modalRef} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        {editingUser && (
                            <form onSubmit={handleUpdateUser}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Modifier : {editingUser.name}</h5>
                                    <button type="button" className="btn-close" onClick={() => bsModal.hide()}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Rôle</label>
                                        <select
                                            className="form-select"
                                            value={editingUser.role}
                                            onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                                        >
                                            <option value="candidate">Candidat</option>
                                            <option value="recruiter">Recruteur</option>
                                        </select>
                                    </div>
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="isActiveSwitch"
                                            checked={editingUser.is_active}
                                            onChange={e => setEditingUser({ ...editingUser, is_active: e.target.checked })}
                                        />
                                        <label className="form-check-label" htmlFor="isActiveSwitch">Compte Actif</label>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => bsModal.hide()}>Annuler</button>
                                    <button type="submit" className="btn btn-primary">Enregistrer</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageUsersPage;
