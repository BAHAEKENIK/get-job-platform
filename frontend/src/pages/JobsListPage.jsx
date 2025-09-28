import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import JobService from '../services/JobService';
import JobCard from '../components/JobCard';
import styles from './JobsListPage.module.css';

const JobsListPage = () => {
    const [jobsData, setJobsData] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [location, setLocation] = useState(searchParams.get('location') || '');

    const canvasRef = useRef(null);

    // 🎨 Logique d'animation des particules
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            if (canvasRef.current) {
                canvasRef.current.width = canvasRef.current.offsetWidth;
                canvasRef.current.height = canvasRef.current.offsetHeight;
            }
        };
        resizeCanvas();

        const particles = [];
        const colors = ['#3498db', '#9b59b6', '#2ecc71', '#f1c40f'];

        for (let i = 0; i < 120; i++) {
            particles.push({
                x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                r: Math.random() * 2.5 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                dx: (Math.random() - 0.5) * 0.4, dy: (Math.random() - 0.5) * 0.4,
            });
        }
        
        let mouse = { x: null, y: null };
        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
        };
        canvas.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.dx; p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
                if(mouse.x && mouse.y) {
                    const distX = mouse.x - p.x; const distY = mouse.y - p.y;
                    const dist = Math.sqrt(distX * distX + distY * distY);
                    if (dist < 150) { p.x -= distX/15; p.y -= distY/15; }
                }
                if (Math.random() < 0.005) p.color = colors[Math.floor(Math.random() * colors.length)];
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color; ctx.fill();
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

    // Le useEffect qui charge les données
    useEffect(() => {
        const fetchJobs = () => {
            setLoading(true);
            setError(null);
            JobService.getAllJobs(searchParams)
                .then(response => {
                    setJobsData(response.data);
                })
                .catch(err => {
                    setError('Impossible de charger les offres d\'emploi.');
                })
                .finally(() => {
                    setLoading(false);
                });
        };
        fetchJobs();
    }, [searchParams]);

    const handleSearch = (e) => {
        e.preventDefault();
        const newParams = new URLSearchParams();
        if (keyword) newParams.set('keyword', keyword);
        if (location) newParams.set('location', location);
        newParams.set('page', '1');
        setSearchParams(newParams);
    };

    const handlePageClick = (linkUrl) => {
        if (!linkUrl) return;
        const url = new URL(linkUrl);
        setSearchParams(url.searchParams);
    };

    return (
        <div className={styles.pageContainer}>
            <canvas ref={canvasRef} className={styles.backgroundCanvas} />
            <div className={styles.contentWrapper}>
                <div className={styles.headerCard}>
                    <h1 className={styles.title}>Trouvez l'offre qui vous correspond</h1>
                    <form onSubmit={handleSearch} className="row g-3">
                        <div className="col-12 col-md-5"> {/* Devient 1 colonne sur mobile */}
                            <input type="text" className="form-control" placeholder="Mot-clé..." value={keyword} onChange={e => setKeyword(e.target.value)} />
                        </div>
                        <div className="col-12 col-md-5"> {/* Devient 1 colonne sur mobile */}
                            <input type="text" className="form-control" placeholder="Lieu..." value={location} onChange={e => setLocation(e.target.value)} />
                        </div>
                        <div className="col-12 col-md-2"> {/* Devient 1 colonne sur mobile */}
                            <button type="submit" className="btn btn-primary w-100">Rechercher</button>
                        </div>
                    </form>
                </div>
                
                {loading && <div className="d-flex justify-content-center p-5"><div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div></div>}
                
                {error && <div className="alert alert-danger">{error}</div>}
                
                {!loading && jobsData && (
                    <>
                        <div>
                            {jobsData.data?.length > 0 ? (
                                jobsData.data.map(job => <JobCard key={job.id} job={job} />)
                            ) : (
                                <div className={styles.headerCard} style={{ background: 'rgba(255, 255, 255, 0.7)'}}>
                                    <h4 className="text-muted">Aucune offre ne correspond à votre recherche.</h4>
                                </div>
                            )}
                        </div>
                        
                        {jobsData.meta?.last_page > 1 && (
                            <nav>
                                <ul className={styles.pagination}>
                                    {jobsData.meta.links?.map((link, index) => (
                                        <li key={index} className={`${styles.pageItem} ${link.active ? styles.active : ''} ${!link.url ? styles.disabled : ''}`}>
                                            <button 
                                                className={styles.pageLink}
                                                onClick={() => handlePageClick(link.url)}
                                                disabled={!link.url}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default JobsListPage;