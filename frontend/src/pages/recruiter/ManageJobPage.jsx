import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import JobService from '../../services/JobService';

const ManageJobPage = () => {
    const [job, setJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [jobResponse, applicantsResponse] = await Promise.all([
                    JobService.getJobById(id),
                    JobService.getApplicantsForJob(id)
                ]);
                setJob(jobResponse.data.data);
                setApplicants(applicantsResponse.data.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des données", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <p>Chargement des détails de l'offre...</p>;
    if (!job) return <p>Offre non trouvée.</p>;

    return (
        <div className="container">
            <Link to="/recruiter/dashboard" className="btn btn-secondary mb-3">
                &larr; Retour à mon tableau de bord
            </Link>

            <div className="card mb-4">
                <div className="card-body">
                     <h2 className="card-title">{job.title}</h2>
                     <p className="card-text text-muted">{job.location}</p>
                </div>
            </div>

            <h3>Candidats pour cette offre ({applicants.length})</h3>
            {applicants.length > 0 ? (
                <div className="list-group">
                    {applicants.map(app => (
                        <div key={app.id} className="list-group-item">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <strong>{app.candidate.name}</strong> ({app.candidate.email})
                                    <br/>
                                    <small>A postulé le: {new Date(app.applied_at).toLocaleDateString()}</small>
                                </div>
                                <div>
                                    <a href={app.cv_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                                        Voir le CV
                                    </a>
                                    {/* Future status update buttons */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Il n'y a pas encore de candidat pour cette offre.</p>
            )}
        </div>
    );
};

export default ManageJobPage;