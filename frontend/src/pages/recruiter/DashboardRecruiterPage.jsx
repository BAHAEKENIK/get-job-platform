import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import JobService from '../../services/JobService';
import styles from './DashboardRecruiterPage.module.css';
import { FaPlusCircle, FaCog, FaTrashAlt } from 'react-icons/fa';

const DashboardRecruiterPage = () => {
    const [myJobs, setMyJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const canvasRef = useRef(null);

    // 🎨 Logique d'animation des particules (version corrigée)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // On s'assure que le canvas a les bonnes dimensions
        const resizeCanvas = () => {
            if (canvasRef.current) {
                canvasRef.current.width = canvasRef.current.offsetWidth;
                canvasRef.current.height = canvasRef.current.offsetHeight;
            }
        };
        resizeCanvas();

        const particles = [];
        const colors = ['#3498db', '#9b59b6', '#2ecc71', '#f1c40f'];

        for (let i = 0; i < 100; i++) {
            particles.push({
                x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                r: Math.random() * 2.5 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                dx: (Math.random() - 0.5) * 0.4, dy: (Math.random() - 0.5) * 0.4
            });
        }
        
        let mouse = { x: null, y: null };
        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };
        // L'écouteur est sur le canvas pour plus de précision
        canvas.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.dx; p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

                if (mouse.x && mouse.y) {
                    const distX = mouse.x - p.x; const distY = mouse.y - p.y;
                    const dist = Math.sqrt(distX * distX + distY * distY);
                    if (dist < 150) { p.x -= distX/15; p.y -= distY/15; }
                }

                if (Math.random() < 0.005) p.color = colors[Math.floor(Math.random() * colors.length)];
                
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
    
    // Chargement des offres (INCHANGÉ)
    const fetchMyJobs = async () => {
        setLoading(true); // Re-set loading
        try {
            const response = await JobService.getMyJobs();
            setMyJobs(response.data.data);
        } catch (error) { console.error("Impossible de charger vos offres."); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchMyJobs(); }, []);

    // Logique de suppression (INCHANGÉE)
    const handleDelete = async (jobId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
            try {
                await JobService.deleteJob(jobId);
                fetchMyJobs();
            } catch (error) { alert("Erreur lors de la suppression."); }
        }
    };
    
    // Affichage
    return (
        <div className={styles.pageContainer}>
            <canvas ref={canvasRef} className={styles.backgroundCanvas} />
            <div className={styles.contentWrapper}>
                <header className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Mes Offres d'Emploi</h1>
                    <Link to="/recruiter/jobs/create" className={`btn btn-primary ${styles.createJobBtn}`}>
                        <FaPlusCircle />
                        <span>Poster une Offre</span>
                    </Link>
                </header>
                
                {loading ? (
                    <div className="d-flex justify-content-center p-5">
                        <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}}></div>
                    </div>
                ) : myJobs.length > 0 ? (
                    <div>
                        {myJobs.map(job => (
                            <div key={job.id} className={styles.jobListItem}>
                                <div>
                                    <h5 className={styles.jobTitle}>{job.title}</h5>
                                    <small className={styles.jobLocation}>{job.location}</small>
                                </div>
                                <div className={styles.actions}>
                                    <Link to={`/recruiter/jobs/${job.id}/manage`} className="btn btn-sm btn-info" title="Gérer">
                                        <FaCog /> Gérer ({job.applicants_count || 0})
                                    </Link>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(job.id)} title="Supprimer">
                                        <FaTrashAlt /> Supprimer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                     <div className="text-center p-5 bg-light rounded-3 shadow-sm">
                        <h4>Vous n'avez encore posté aucune offre.</h4>
                        <p className="text-muted">Cliquez sur le bouton ci-dessous pour créer votre première offre et trouver le candidat parfait !</p>
                        <Link to="/recruiter/jobs/create" className={`btn btn-primary mt-3 ${styles.createJobBtn}`}>
                            <FaPlusCircle />
                            <span>Poster ma première offre</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardRecruiterPage;