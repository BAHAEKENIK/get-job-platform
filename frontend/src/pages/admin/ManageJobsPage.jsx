import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import AdminService from '../../services/AdminService';
import { FaEye, FaTrashAlt } from 'react-icons/fa';
import styles from './ManageJobsPage.module.css';

const ManageJobsPage = () => {
    const [jobsData, setJobsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const canvasRef = useRef(null);

    // 🎨 Logique d'animation des particules (style Admin/Login)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        const resizeCanvas = () => {
            if(canvasRef.current) {
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

    const fetchJobs = () => {
        setLoading(true);
        const params = Object.fromEntries(searchParams.entries());
        AdminService.getAllJobs(params)
            .then(response => setJobsData(response.data))
            .catch(error => console.error("Erreur de chargement", error))
            .finally(() => setLoading(false));
    };

    useEffect(fetchJobs, [searchParams]);

    const handleSearch = () => {
        const newParams = { page: 1 };
        if (searchTerm) newParams.search = searchTerm;
        setSearchParams(newParams);
    };

    const handleDelete = async (jobId) => {
        if (window.confirm("Supprimer cette offre ? Cette action est irréversible.")) {
            try {
                await AdminService.deleteJob(jobId);
                fetchJobs(); // Recharger
            } catch (error) { alert("Erreur lors de la suppression."); }
        }
    };
    
    return (
        <div className={styles.pageContainer}>
            <canvas ref={canvasRef} className={styles.backgroundCanvas} />
            <div className={styles.contentCard}>
                <header className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Gestion des Offres d'Emploi</h1>
                    <span className="text-muted">{jobsData ? jobsData.meta.total : 0} offres</span>
                </header>
                
                <div className="row g-3 mb-4">
                    <div className="col-md-9">
                        <input type="text" className="form-control" placeholder="Rechercher par titre, description ou recruteur..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}/>
                    </div>
                    <div className="col-md-3">
                        <button className="btn btn-primary w-100" onClick={handleSearch}>Rechercher</button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className={`table table-hover align-middle ${styles.table}`}>
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Titre du poste</th>
                                <th>Recruteur</th>
                                <th>Lieu</th>
                                <th>Date de création</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center p-5"><div className="spinner-border"></div></td></tr>
                            ) : jobsData?.data.map(job => (
                                <tr key={job.id}>
                                    <td>{job.id}</td>
                                    <td>{job.title}</td>
                                    <td>{job.recruiter.name}</td>
                                    <td>{job.location}</td>
                                    <td>{new Date(job.posted_at).toLocaleDateString('fr-FR')}</td>
                                    <td className="text-end">
                                        <Link to={`/jobs/${job.id}`} className="btn btn-sm btn-outline-info me-2" title="Voir l'offre">
                                            <FaEye />
                                        </Link>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(job.id)} title="Supprimer l'offre">
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {jobsData && jobsData.meta.last_page > 1 && (
                    <nav className="mt-4 d-flex justify-content-center">
                        <ul className="pagination">
                            {jobsData.meta.links.map((link, index) => (
                                <li key={index} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link"
                                        onClick={() => link.url && setSearchParams({ ...Object.fromEntries(searchParams.entries()), page: new URL(link.url).searchParams.get('page') })}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
            </div>
        </div>
    );
};

export default ManageJobsPage;