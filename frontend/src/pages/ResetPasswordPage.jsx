import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/AuthService';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canvasRef = useRef(null);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  // 🎨 Particle background
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
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        const distX = mouse.x - p.x;
        const distY = mouse.y - p.y;
        const dist = Math.sqrt(distX * distX + distY * distY);
        if (dist < 100) {
          p.x -= distX / 10;
          p.y -= distY / 10;
        }

        if (Math.random() < 0.005) {
          p.color = colors[Math.floor(Math.random() * colors.length)];
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();

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

    const resetData = { token, email, password, password_confirmation: passwordConfirmation };

    try {
      await AuthService.resetPassword(resetData);
      setMessage('Votre mot de passe a été réinitialisé avec succès ! Vous pouvez maintenant vous connecter.');
    } catch (err) {
      setError('Le token est invalide ou a expiré. Veuillez refaire une demande.');
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Lien invalide</h2>
        <p>Le lien de réinitialisation est incomplet ou invalide.</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {/* Canvas background */}
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}></canvas>

      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '500px',
        background: 'rgba(255,255,255,0.9)',
        padding: '2.5rem',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Réinitialiser le mot de passe</h2>

        {message && (
          <div style={{ marginBottom: '1rem', padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px' }}>
            {message}
            <div className="mt-2">
              <Link to="/login" style={{ display: 'inline-block', marginTop: '10px', padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', borderRadius: '5px', textDecoration: 'none' }}>Se connecter</Link>
            </div>
          </div>
        )}

        {error && <div style={{ marginBottom: '1rem', padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px' }}>{error}</div>}

        {!message && (
          <form onSubmit={handleSubmit}>
            <input type="hidden" value={email} readOnly />
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Nouveau mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Confirmez le nouveau mot de passe</label>
              <input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da' }} />
            </div>
            <button type="submit" disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                border: 'none',
                borderRadius: '8px',
                backgroundImage: 'linear-gradient(to right, #6a11cb 0%, #2575fc 51%, #6a11cb 100%)',
                color: '#fff',
                fontWeight: '600',
                cursor: 'pointer',
              }}>
              {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
