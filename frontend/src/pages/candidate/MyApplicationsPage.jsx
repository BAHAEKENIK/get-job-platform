import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ApplicationService from '../../services/ApplicationService';
import styles from './MyApplicationsPage.module.css';

const MyApplicationsPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const canvasRef = useRef(null);

    // 🎨 Logique d'animation des particules
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            if(canvasRef.current){
                canvasRef.current.width = canvasRef.current.offsetWidth;
                canvasRef.current.height = canvasRef.current.offsetHeight;
            }
        };
        resizeCanvas();

        const particles = Array.from({ length: 100 }, () => ({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            r: Math.random() * 2.5 + 1, color: `rgba(0,0,0, ${Math.random() * 0.05})`,
            dx: (Math.random() - 0.5) * 0.2, dy: (Math.random() - 0.5) * 0.2
        }));

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.dx; p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color; ctx.fill();
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

    // Chargement des candidatures
    useEffect(() => {
        ApplicationService.getMyApplications()
            .then(response => setApplications(response.data.data))
            .catch(error => console.error("Impossible de charger les candidatures", error))
            .finally(() => setLoading(false));
    }, []);

    const getStatusInfo = (status) => {
        const statusMap = {
            pending: { text: 'En attente', color: 'secondary' },
            viewed: { text: 'Consultée', color: 'info' },
            accepted: { text: 'Acceptée', color: 'success' },
            rejected: { text: 'Rejetée', color: 'danger' }
        };
        return statusMap[status] || { text: status, color: 'light' };
    };

    if (loading) {
        return (
            <div className={styles.pageContainer}>
                <div className="d-flex justify-content-center p-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            </div>
        );
    }
    
    return (
        <div className={styles.pageContainer}>
            <canvas ref={canvasRef} className={styles.backgroundCanvas} />
            <div className={styles.contentWrapper}>
                <h1 className={styles.pageTitle}>Mes Candidatures</h1>
                
                {applications.length > 0 ? (
                    <div>
                        {applications.map(app => {
                            const statusInfo = getStatusInfo(app.status);
                            return (
                                <div key={app.id} className={styles.applicationCard}>
                                    <div>
                                        <h5 className={styles.jobTitle}>
                                            <Link to={`/jobs/${app.job.id}`}>{app.job.title}</Link>
                                        </h5>
                                        <p className={styles.date}>
                                            Postulé le: {new Date(app.applied_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className={styles.status}>
                                        <p className={`mb-1 ${styles.statusLabel}`}>Statut</p>
                                        <span className={`badge ${styles.statusBadge} bg-${statusInfo.color}`}>{statusInfo.text}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className={styles.noApplications}>
                        <h5>Vous n'avez encore postulé à aucune offre.</h5>
                        <p>Parcourez nos offres pour trouver votre prochain emploi !</p>
                        <Link to="/jobs" className="btn btn-primary mt-3">Voir les offres</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApplicationsPage;