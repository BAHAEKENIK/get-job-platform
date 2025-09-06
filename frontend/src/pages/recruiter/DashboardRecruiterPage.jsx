import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobService from '../../services/JobService';

const DashboardRecruiterPage = () => {
    const [myJobs, setMyJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyJobs = async () => {
        try {
            const response = await JobService.getMyJobs();
            setMyJobs(response.data.data);
        } catch (error) {
            console.error("Impossible de charger vos offres.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const handleDelete = async (jobId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
            try {
                await JobService.deleteJob(jobId);
                // Recharger la liste après suppression
                fetchMyJobs();
            } catch (error) {
                alert("Erreur lors de la suppression.");
            }
        }
    };

    if (loading) return <p>Chargement...</p>;

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Mes Offres Postées</h1>
                <Link to="/recruiter/jobs/create" className="btn btn-primary">Poster une nouvelle offre</Link>
            </div>

            {myJobs.length > 0 ? (
                <ul className="list-group">
                    {myJobs.map(job => (
                        <li key={job.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h5>{job.title}</h5>
                                <small>{job.location}</small>
                            </div>
                            <div>
                                {/* Link to Edit page will be added later */}
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(job.id)}>Supprimer</button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Vous n'avez encore posté aucune offre.</p>
            )}
        </div>
    );
};

export default DashboardRecruiterPage;