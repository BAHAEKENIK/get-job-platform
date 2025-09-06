import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import JobService from '../services/JobService';

const JobDetailPage = () => {
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams(); // Récupère l'ID depuis l'URL

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await JobService.getJobById(id);
                setJob(response.data.data); // API Resource nests result in 'data'
            } catch (err) {
                setError('Offre d\'emploi non trouvée.');
            } finally {
                setLoading(false);
            }
        };
        fetchJobDetails();
    }, [id]);

    if (loading) return <p>Chargement...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!job) return null;

    return (
        <div className="container">
            <Link to="/jobs" className="btn btn-secondary mb-4">Retour à la liste</Link>
            
            <div className="card">
                <div className="card-header">
                     <h2>{job.title}</h2>
                </div>
                <div className="card-body">
                    <h5 className="card-subtitle mb-3 text-muted">Posté par: {job.recruiter.name}</h5>
                    <p><strong>Lieu:</strong> {job.location}</p>
                    <p><strong>Type de contrat:</strong> {job.contract_type}</p>
                    {job.salary_amount && (
                         <p><strong>Salaire:</strong> {job.salary_amount} {job.salary_currency}</p>
                    )}
                    <hr/>
                    <h4>Description du poste</h4>
                    <div dangerouslySetInnerHTML={{ __html: job.description.replace(/\n/g, '<br />') }} />
                </div>
                 <div className="card-footer text-muted">
                    Posté le: {new Date(job.posted_at).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

export default JobDetailPage;