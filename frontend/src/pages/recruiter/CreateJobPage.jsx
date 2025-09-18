import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobService from '../../services/JobService';
import styles from './CreateJobPage.module.css';

const currencies = ["AED", "AFN", "ALL", "AMD", /* ... et toutes les autres ... */ "ZWL"];

const CreateJobPage = () => {
    const [jobData, setJobData] = useState({
        title: '', description: '', location: '', contract_type: 'Full-time',
        salary_amount: '', salary_currency: 'USD'
    });
    const navigate = useNavigate();
    const canvasRef = useRef(null);

    // 🎨 Logique d'animation des particules (style Login/ForgotPassword)
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

        const particles = [];
        const colors = ['#3498db', '#e74c3c', '#9b59b6', '#2ecc71', '#f1c40f'];

        for (let i = 0; i < 80; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 2.5 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                dx: (Math.random() - 0.5) * 0.4,
                dy: (Math.random() - 0.5) * 0.4,
            });
        }

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
                p.x += p.dx; p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
                
                if (mouse.x && mouse.y) {
                    const distX = mouse.x - p.x;
                    const distY = mouse.y - p.y;
                    const dist = Math.sqrt(distX * distX + distY * distY);
                    if (dist < 150) {
                        p.x -= distX / 10; p.y -= distY / 10;
                    }
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await JobService.createJob(jobData);
            alert('✅ Offre postée avec succès !');
            navigate('/recruiter/dashboard');
        } catch (error) {
            console.error("Erreur lors de la création de l'offre:", error);
            alert('❌ Une erreur est survenue.');
        }
    };

    return (
        <div className={styles.pageContainer}>
            <canvas ref={canvasRef} className={styles.backgroundCanvas} />
            <div className={styles.formCard}>
                <h2 className={styles.formTitle}>Poster une nouvelle offre d'emploi</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Titre du poste</label>
                        <input type="text" name="title" value={jobData.title} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Description</label>
                        <textarea name="description" value={jobData.description} onChange={handleChange} rows="5" required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Lieu</label>
                        <input type="text" name="location" value={jobData.location} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Type de contrat</label>
                        <select name="contract_type" value={jobData.contract_type} onChange={handleChange}>
                            <option value="Full-time">Temps plein</option>
                            <option value="Part-time">Temps partiel</option>
                            <option value="Contract">Contrat</option>
                            <option value="Internship">Stage</option>
                        </select>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Salaire (optionnel)</label>
                            <input type="number" name="salary_amount" value={jobData.salary_amount} onChange={handleChange} placeholder="ex: 50000" />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Devise</label>
                            <select name="salary_currency" value={jobData.salary_currency} onChange={handleChange}>
                                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <button type="submit" className={styles.submitBtn}>Poster l'offre</button>
                </form>
            </div>
        </div>
    );
};

export default CreateJobPage;