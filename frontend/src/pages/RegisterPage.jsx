import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RegisterPage = () => {
    // ... les useStates restent les mêmes (name, email, etc.) ...
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [role, setRole] = useState('candidate');

    const { register } = useContext(AuthContext); // Obtenir la fonction register
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const registerData = { name, email, password, password_confirmation: passwordConfirmation, role };
            await register(registerData);
            alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
            navigate('/login'); // Rediriger vers la page de connexion
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Erreur lors de l\'inscription.');
        }
    };

    // Le JSX reste exactement le même qu'avant...
    return (
         <div className="container mt-5">
            <h2>Inscription</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nom</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Mot de passe</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Confirmation du mot de passe</label>
                    <input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className="form-control" required />
                </div>
                 <div className="mb-3">
                    <label className="form-label">Je suis un...</label>
                    <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="candidate">Candidat</option>
                        <option value="recruiter">Recruteur</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">S'inscrire</button>
            </form>
        </div>
    );
};

export default RegisterPage;