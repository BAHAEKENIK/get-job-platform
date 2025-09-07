import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import JobService from '../services/JobService';
import { AuthContext } from '../context/AuthContext'; // <-- ajouté
import ApplicationService from '../services/ApplicationService'; // <-- ajouté

const JobDetailPage = () => {
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    // Auth & navigation
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // States pour la candidature
    const [cvFile, setCvFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [applyError, setApplyError] = useState('');
    const [applySuccess, setApplySuccess] = useState('');

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await JobService.getJobById(id);
                setJob(response.data.data);
            } catch (err) {
                setError('Offre d\'emploi non trouvée.');
            } finally {
                setLoading(false);
            }
        };
        fetchJobDetails();
    }, [id]);

    // Gestion du fichier
    const handleFileChange = (e) => {
        setCvFile(e.target.files[0]);
    };

    // Envoi de la candidature
    const handleApply = async (e) => {
        e.preventDefault();
        if (!cvFile) {
            setApplyError('Veuillez sélectionner votre CV (PDF).');
            return;
        }

        setIsSubmitting(true);
        setApplyError('');
        setApplySuccess('');

        const formData = new FormData();
        formData.append('cv', cvFile);

        try {
            await ApplicationService.apply(id, formData);
            setApplySuccess('Votre candidature a été envoyée avec succès !');
        } catch (err) {
            if (err.response && err.response.status === 409) {
                setApplyError('Vous avez déjà postulé à cette offre.');
            } else {
                setApplyError('Une erreur est survenue lors de l\'envoi.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Redirection si pas connecté
    const handleRedirectToLogin = () => {
        navigate('/login', { state: { from: location } });
    };

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
                    <hr />
                    <h4>Description du poste</h4>
                    <div dangerouslySetInnerHTML={{ __html: job.description.replace(/\n/g, '<br />') }} />
                </div>
                <div className="card-footer text-muted">
                    Posté le: {new Date(job.posted_at).toLocaleDateString()}
                </div>
            </div>

            {/* Section candidature */}
            <div className="card mt-4">
                <div className="card-body">
                    <h4 className="card-title">Postuler à cette offre</h4>

                    {/* Cas 1 : candidat connecté */}
                    {user && user.role === 'candidate' && (
                        <form onSubmit={handleApply}>
                            {applySuccess && <div className="alert alert-success">{applySuccess}</div>}
                            {applyError && <div className="alert alert-danger">{applyError}</div>}

                            {!applySuccess && (
                                <>
                                    <div className="mb-3">
                                        <label htmlFor="cv" className="form-label">
                                            Votre CV (format PDF, 2Mo max)
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="cv"
                                            onChange={handleFileChange}
                                            accept=".pdf"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                        {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma candidature'}
                                    </button>
                                </>
                            )}
                        </form>
                    )}

                    {/* Cas 2 : utilisateur non connecté */}
                    {!user && (
                        <div>
                            <p>Vous devez être connecté en tant que candidat pour postuler.</p>
                            <button onClick={handleRedirectToLogin} className="btn btn-primary">
                                Se connecter pour postuler
                            </button>
                        </div>
                    )}

                    {/* Cas 3 : recruteur ou admin */}
                    {user && user.role !== 'candidate' && (
                        <p>Les recruteurs et administrateurs ne peuvent pas postuler aux offres.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDetailPage;
