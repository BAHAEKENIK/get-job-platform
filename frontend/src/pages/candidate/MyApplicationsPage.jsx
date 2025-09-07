import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApplicationService from '../../services/ApplicationService';

const MyApplicationsPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await ApplicationService.getMyApplications();
                setApplications(response.data.data);
            } catch (error) {
                console.error("Impossible de charger les candidatures", error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return 'secondary';
            case 'viewed': return 'info';
            case 'accepted': return 'success';
            case 'rejected': return 'danger';
            default: return 'light';
        }
    };

    if (loading) return <p>Chargement de vos candidatures...</p>;

    return (
        <div className="container">
            <h1 className="mb-4">Mes Candidatures</h1>
            {applications.length > 0 ? (
                <div className="list-group">
                    {applications.map(app => (
                        <div key={app.id} className="list-group-item">
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">
                                    <Link to={`/jobs/${app.job.id}`}>{app.job.title}</Link>
                                </h5>
                                <small>Postulé le: {new Date(app.applied_at).toLocaleDateString()}</small>
                            </div>
                            <p className="mb-1">Statut: 
                                <span className={`badge bg-${getStatusBadge(app.status)} ms-2`}>
                                    {app.status}
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Vous n'avez encore postulé à aucune offre.</p>
            )}
        </div>
    );
};

export default MyApplicationsPage;