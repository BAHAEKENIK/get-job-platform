import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import JobService from '../../services/JobService';
import ChatService from '../../services/ChatService';
import ApplicationService from '../../services/ApplicationService';
import styles from './ManageJobPage.module.css';

const ManageJobPage = () => {
    const [job, setJob] = useState(null);
    const [applicants, setApplicants] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const canvasRef = useRef(null);

    // 🎨 Particle animation background (same style as login/forgot password pages)
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

        const particles = Array.from({ length: 100 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2.5 + 1,
            color: `rgba(0, 0, 0, ${Math.random() * 0.1 + 0.02})`,
            dx: (Math.random() - 0.5) * 0.3,
            dy: (Math.random() - 0.5) * 0.3,
        }));

        let mouse = { x: null, y: null };
        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };
        canvas.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

                if (mouse.x && mouse.y) {
                    const distX = mouse.x - p.x;
                    const distY = mouse.y - p.y;
                    const dist = Math.sqrt(distX * distX + distY * distY);
                    if (dist < 150) {
                        p.x -= distX / 15;
                        p.y -= distY / 15;
                    }
                }

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
            canvas.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // 📥 Fetch job & applicants data
    useEffect(() => {
        const fetchData = async (page) => {
            setLoading(true);
            try {
                const applicantsResponse = await JobService.getApplicantsForJob(id, page);
                if (page === 1 && !job) {
                    const jobResponse = await JobService.getJobById(id);
                    setJob(jobResponse.data.data);
                }
                setApplicants(applicantsResponse.data);
            } catch (error) {
                console.error("Erreur de récupération", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData(currentPage);
    }, [id, currentPage, job]);

    // 🔵 Utils
    const getStatusBadge = (status) => {
        switch (status) {
            case "pending": return "secondary";
            case "viewed": return "info";
            case "accepted": return "success";
            case "rejected": return "danger";
            default: return "dark";
        }
    };

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            await ApplicationService.updateApplicationStatus(applicationId, newStatus);
            setApplicants(prev => ({
                ...prev,
                data: prev.data.map(app =>
                    app.id === applicationId ? { ...app, status: newStatus } : app
                )
            }));
        } catch (error) {
            alert("❌ Une erreur est survenue.");
        }
    };

    const handleStartChat = async (candidateId) => {
        if (!window.confirm("Démarrer une conversation ?")) return;
        try {
            const response = await ChatService.startConversation(candidateId);
            navigate('/chat', { state: { newConversationId: response.data.data.id } });
        } catch (error) {
            alert("Impossible de démarrer la conversation.");
        }
    };

    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage });
    };

    // ⏳ Loader
    if (loading || !applicants) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "calc(100vh - 56px)" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    // ❌ Job not found
    if (!job) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "calc(100vh - 56px)" }}>
                <p className="text-danger">Offre non trouvée.</p>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            {/* Animated background */}
            <canvas ref={canvasRef} className={styles.backgroundCanvas} />

            {/* Content */}
            <div className={styles.contentCard}>
                <Link to="/recruiter/dashboard" className="btn btn-outline-secondary mb-4">&larr; Retour</Link>

                <header className={styles.header}>
                    <h1 className={styles.title}>{job.title}</h1>
                    <p className={styles.location}>{job.location}</p>
                </header>

                <h3 className={styles.sectionTitle}>Candidats ({applicants.meta.total})</h3>

                {applicants.data.length > 0 ? (
                    <ul className={styles.applicantList}>
                        {applicants.data.map(app => (
                            <li key={app.id} className={styles.applicantItem}>
                                <div className={styles.applicantInfo}>
                                    <strong>{app.candidate.name}</strong> ({app.candidate.email})<br />
                                    <small className="text-muted">
                                        Postulé le: {new Date(app.applied_at).toLocaleDateString('fr-FR')}
                                    </small>
                                </div>
                                <div className={styles.applicantActions}>
                                    <span className={`badge bg-${getStatusBadge(app.status)} me-3`}>
                                        {app.status}
                                    </span>
                                    <select
                                        className="form-select form-select-sm"
                                        value={app.status}
                                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                    >
                                        <option value="pending">En attente</option>
                                        <option value="viewed">Consultée</option>
                                        <option value="accepted">Accepté</option>
                                        <option value="rejected">Rejeté</option>
                                    </select>
                                    <button
                                        className="btn btn-success btn-sm ms-2"
                                        onClick={() => handleStartChat(app.candidate.id)}
                                    >
                                        Chatter
                                    </button>
                                    <a
                                        href={app.cv_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary btn-sm ms-2"
                                    >
                                        CV
                                    </a>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-muted p-4">
                        Il n'y a pas encore de candidat pour cette offre.
                    </p>
                )}

                {/* Pagination */}
                {applicants.meta.last_page > 1 && (
                    <nav className={styles.pagination}>
                        <ul className="pagination justify-content-center">
                            {Array.from({ length: applicants.meta.last_page }, (_, i) => i + 1).map(page => (
                                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                    <button
                                        className={`page-link ${styles.pageLink}`}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
            </div>
        </div>
    );
};

export default ManageJobPage;
