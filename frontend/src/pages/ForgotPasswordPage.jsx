import React, { useState, useEffect, useRef } from 'react';
import AuthService from '../services/AuthService';
import { Link } from 'react-router-dom';
import styles from './ForgotPasswordPage.module.css';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const canvasRef = useRef(null);

    // 🎨 Animation des points
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#5f27cd'];

        for (let i = 0; i < 120; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 3 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                dx: (Math.random() - 0.5) * 1,
                dy: (Math.random() - 0.5) * 1,
            });
        }

        let mouse = { x: null, y: null };
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                // Déplacement
                p.x += p.dx;
                p.y += p.dy;

                // Bords
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

                // Effet souris (repousser)
                const distX = mouse.x - p.x;
                const distY = mouse.y - p.y;
                const dist = Math.sqrt(distX * distX + distY * distY);
                if (dist < 100) {
                    p.x -= distX / 10;
                    p.y -= distY / 10;
                }

                // Changer couleur aléatoire parfois
                if (Math.random() < 0.005) {
                    p.color = colors[Math.floor(Math.random() * colors.length)];
                }

                // Dessin
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            });
            requestAnimationFrame(animate);
        }
        animate();

        // Resize
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', () => {});
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            await AuthService.forgotPassword(email);
            setMessage('Si un compte est associé à cet email, un lien de réinitialisation a été envoyé.');
        } catch (err) {
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.forgotPasswordPage}>
            <canvas ref={canvasRef} className={styles.background}></canvas>

            <div className={styles.formContainer}>
                <h2>Mot de passe oublié</h2>
                <p>Entrez votre adresse e-mail ci-dessous pour recevoir les instructions de réinitialisation.</p>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Adresse e-mail</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? 'Envoi...' : 'Envoyer le lien'}
                    </button>
                </form>
                <div className="text-center mt-3">
                    <Link to="/login">Retour à la connexion</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
