import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import JobService from '../services/JobService';
import ChatService from '../services/ChatService'; 
import { AuthContext } from '../context/AuthContext';
import ApplicationService from '../services/ApplicationService';
import styles from './JobDetailPage.module.css'; // 🎨 CSS Module for styling
import { FaMapMarkerAlt, FaFileContract, FaMoneyBillWave, FaPaperPlane, FaCommentDots, FaArrowLeft } from 'react-icons/fa';

const JobDetailPage = () => {
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [cvFile, setCvFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [applyError, setApplyError] = useState('');
    const [applySuccess, setApplySuccess] = useState('');

    const canvasRef = useRef(null);

    // 🎨 Particle background animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resizeCanvas();

        const particles = Array.from({ length: 80 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 1,
            color: `rgba(0, 0, 0, ${Math.random() * 0.1 + 0.05})`,
            dx: (Math.random() - 0.5) * 0.2,
            dy: (Math.random() - 0.5) * 0.2,
        }));

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        window.addEventListener('resize', resizeCanvas);
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // 📥 Load job details
    useEffect(() => {
        JobService.getJobById(id)
            .then(response => setJob(response.data.data))
            .catch(() => setError('Offre d\'emploi non trouvée.'))
            .finally(() => setLoading(false));
    }, [id]);

    // 🔵 Chat with recruiter
    const handleStartChatWithRecruiter = async (recruiterId) => {
        try {
            const response = await ChatService.startConversation(recruiterId);
            const newConversationId = response.data.data.id;
            navigate('/chat', { state: { newConversationId } });
        } catch (error) {
            console.error("Impossible de démarrer la conversation:", error);
            alert("Une erreur est survenue.");
        }
    };

    // 📤 Apply logic
    const handleFileChange = (e) => setCvFile(e.target.files[0]);

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

    const handleRedirectToLogin = () => navigate('/login', { state: { from: location } });

    // Loader / Errors
    if (loading) return <div className="d-flex justify-content-center p-5"><div className="spinner-border text-primary"></div></div>;
    if (error) return <div className="alert alert-danger m-5">{error}</div>;
    if (!job) return null;

    return (
        <div className={styles.pageContainer}>
            {/* Background */}
            <canvas ref={canvasRef} className={styles.backgroundCanvas} />

            <div className={styles.contentWrapper}>
                <Link to="/jobs" className="btn btn-outline-secondary mb-4">
                    <FaArrowLeft className="me-2" />
                    Retour aux offres
                </Link>

                {/* Job Card */}
                <div className={styles.jobCard}>
                    <div className={styles.cardHeader}>
                        <h1 className={styles.jobTitle}>{job.title}</h1>
                        <p className={styles.companyName}>Posté par : {job.recruiter.name}</p>
                    </div>

                    <div className={styles.tagsContainer}>
                        <div className={styles.tag}><FaMapMarkerAlt /> {job.location}</div>
                        <div className={styles.tag}><FaFileContract /> {job.contract_type}</div>
                        {job.salary_amount && (
                            <div className={styles.tag}><FaMoneyBillWave /> {job.salary_amount} {job.salary_currency}</div>
                        )}
                    </div>

                    <div className={styles.jobDescription}>
                        <h4 className="mb-3">Description du poste</h4>
                        <div dangerouslySetInnerHTML={{ __html: job.description.replace(/\n/g, '<br />') }} />
                    </div>
                </div>

                {/* Apply Card */}
                <div className={styles.applyCard}>
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <h4 className="card-title m-0">Intéressé(e) ?</h4>
                            {user?.role === 'candidate' && (
                                <button className="btn btn-success" onClick={() => handleStartChatWithRecruiter(job.recruiter.id)}>
                                    <FaCommentDots className="me-2" /> Poser une question
                                </button>
                            )}
                        </div>
                        <hr />

                        {user?.role === 'candidate' && (
                            <form onSubmit={handleApply}>
                                {applySuccess && <div className="alert alert-success">{applySuccess}</div>}
                                {applyError && <div className="alert alert-danger">{applyError}</div>}

                                {!applySuccess && (
                                    <>
                                        <div className="mb-3">
                                            <label htmlFor="cv" className="form-label">Votre CV (format PDF, 2Mo max)</label>
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
                                            {isSubmitting ? 'Envoi en cours...' : <> <FaPaperPlane className="me-2" /> Envoyer ma candidature</>}
                                        </button>
                                    </>
                                )}
                            </form>
                        )}

                        {!user && (
                            <div>
                                <p>Vous devez être connecté en tant que candidat pour postuler.</p>
                                <button onClick={handleRedirectToLogin} className="btn btn-primary w-100">
                                    Se connecter pour postuler
                                </button>
                            </div>
                        )}

                        {user && user.role !== 'candidate' && (
                            <p className="text-danger">Les recruteurs et administrateurs ne peuvent pas postuler.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetailPage;
