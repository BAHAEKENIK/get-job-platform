import React, { useState } from 'react';
import AuthService from '../services/AuthService';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
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
    );
};

export default ForgotPasswordPage;