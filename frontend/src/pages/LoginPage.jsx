import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Utiliser pour la redirection
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext); // Obtenir la fonction login du contexte
    const navigate = useNavigate(); // Hook pour la redirection

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ email, password });
            navigate('/'); // Rediriger vers la page d'accueil
        } catch (error) {
            console.error('Login failed:', error);
            alert('Échec de la connexion. Vérifiez vos identifiants.');
        }
    };
    // Le JSX reste exactement le même qu'avant...
    return (
        <div className="container mt-5">
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Mot de passe</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
                </div>
                <button type="submit" className="btn btn-primary">Se connecter</button>
            </form>
        </div>
    );
};

export default LoginPage;