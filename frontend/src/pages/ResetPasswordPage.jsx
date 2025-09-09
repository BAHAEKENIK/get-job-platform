import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/AuthService';

const ResetPasswordPage = () => {
    // useSearchParams permet de lire les paramètres de l'URL (?token=...&email=...)
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Récupération du token et de l'email depuis l'URL
    const token = searchParams.get('token');
    const email = searchParams.get('email');

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
            <div className="container mt-5">
                <h2>Lien invalide</h2>
                <p>Le lien de réinitialisation est incomplet ou invalide.</p>
            </div>
        );
    }
    
    return (
         <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <h2>Réinitialiser le mot de passe</h2>
            
            {message && (
                <div className="alert alert-success">
                    {message}
                    <div className="mt-2"><Link to="/login" className="btn btn-sm btn-primary">Se connecter</Link></div>
                </div>
            )}
            {error && <div className="alert alert-danger">{error}</div>}

            {!message && (
                 <form onSubmit={handleSubmit}>
                    <input type="hidden" value={email} readOnly />
                    <div className="mb-3">
                        <label className="form-label">Nouveau mot de passe</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Confirmez le nouveau mot de passe</label>
                        <input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className="form-control" required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default ResetPasswordPage;