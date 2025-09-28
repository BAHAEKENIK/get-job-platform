import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
    FaEye, 
    FaEyeSlash,
    FaUser, 
    FaEnvelope, 
    FaLock, 
    FaBriefcase
} from 'react-icons/fa';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [role, setRole] = useState('candidate');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // 🎨 Animation des points (inchangée)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#5f27cd'];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        r: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        dx: (Math.random() - 0.5) * 1, dy: (Math.random() - 0.5) * 1,
      });
    }
    let mouse = { x: null, y: null };
    const handleMouseMove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        const distX = mouse.x - p.x; const distY = mouse.y - p.y;
        const dist = Math.sqrt(distX * distX + distY * distY);
        if (dist < 100) { p.x -= distX / 10; p.y -= distY / 10; }
        if (Math.random() < 0.005) { p.color = colors[Math.floor(Math.random() * colors.length)]; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
    
    const resize = () => { if(canvasRef.current) { canvasRef.current.width = window.innerWidth; canvasRef.current.height = window.innerHeight; } };
    window.addEventListener('resize', resize);
    
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Logique de soumission (inchangée)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (password !== passwordConfirmation) {
      setErrors({ password_confirmation: "Les mots de passe ne correspondent pas" });
      return;
    }
    try {
      const registerData = { name, email, password, password_confirmation: passwordConfirmation, role };
      await register(registerData);
      alert('Inscription réussie 🎉 ! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    } catch (error) {
      if (error.response?.data?.errors) setErrors(error.response.data.errors);
      else alert("Erreur lors de l'inscription.");
    }
  };

  return (
    <div className={styles.registerPage}>
      <canvas ref={canvasRef} className={styles.background}></canvas>

      <div className={styles.formContainer}>
        <h2 className={`text-center ${styles.formHeader}`}>Créer un Compte</h2>

        <form onSubmit={handleSubmit}>
          {/* Nom */}
          <div className="mb-3">
            <label className="form-label">Nom Complet</label>
            <div className="input-group">
                <span className="input-group-text"><FaUser/></span>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={`form-control ${errors.name ? 'is-invalid' : ''}`} placeholder="ex: Jean Dupont" required />
            </div>
            {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Adresse e-mail</label>
            <div className="input-group">
                <span className="input-group-text"><FaEnvelope/></span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="votre@email.com" required />
            </div>
            {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
          </div>

          {/* Mot de passe */}
          <div className="mb-3">
            <label className="form-label">Mot de passe</label>
            <div className="input-group">
                <span className="input-group-text"><FaLock/></span>
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className={`form-control ${errors.password ? 'is-invalid' : ''}`} required />
              <span className={`input-group-text ${styles.passwordIcon}`} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && <div className="invalid-feedback d-block">{errors.password[0]}</div>}
          </div>

          {/* Confirmation mot de passe */}
          <div className="mb-4">
            <label className="form-label">Confirmer le mot de passe</label>
            <div className="input-group">
                <span className="input-group-text"><FaLock/></span>
              <input type={showPasswordConfirm ? "text" : "password"} value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`} required />
              <span className={`input-group-text ${styles.passwordIcon}`} onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}>
                {showPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password_confirmation && <div className="invalid-feedback d-block">{errors.password_confirmation}</div>}
          </div>

          {/* Rôle */}
          <div className="mb-4">
            <label className="form-label">Vous êtes un...</label>
            <div className="input-group">
                 <span className="input-group-text"><FaBriefcase/></span>
                <select className={`form-select ${errors.role ? 'is-invalid' : ''}`} value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="candidate">Candidat (à la recherche d'un emploi)</option>
                  <option value="recruiter">Recruteur (publiant une offre)</option>
                </select>
            </div>
            {errors.role && <div className="invalid-feedback">{errors.role[0]}</div>}
          </div>

          <button type="submit" className={`w-100 ${styles.submitButton}`}>Créer mon compte</button>
        
          <p className="text-center text-muted mt-3 small">
              Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;