import React, { useState, useContext } from 'react';

import { useNavigate, useLocation , Link} from 'react-router-dom'; // Ajout de useLocation
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext); 
    const navigate = useNavigate();
    const location = useLocation(); // récupération de la location

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ email, password });

            // Vérifie s'il y a une page d'origine, sinon redirige vers /
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });

        } catch (error) {
            console.error('Login failed:', error);
            alert('Échec de la connexion. Vérifiez vos identifiants.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="form-control" 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Mot de passe</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="form-control" 
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-primary">Se connecter</button>
                <div className="text-center mt-3">
                    <Link to="/forgot-password">Mot de passe oublié ?</Link>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
