import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobService from '../../services/JobService';

// Copiez la liste des devises ici pour le formulaire
const currencies = [ "USD", "EUR", "MAD", "CAD", "GBP", /* ...et toutes les autres */ ];

const CreateJobPage = () => {
    const [jobData, setJobData] = useState({
        title: '',
        description: '',
        location: '',
        contract_type: 'Full-time',
        salary_amount: '',
        salary_currency: 'USD'
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await JobService.createJob(jobData);
            alert('Offre postée avec succès !');
            navigate('/recruiter/dashboard');
        } catch (error) {
            console.error("Erreur lors de la création de l'offre:", error);
            alert('Une erreur est survenue.');
        }
    };

    return (
        <div className="container">
            <h2>Poster une nouvelle offre d'emploi</h2>
            <form onSubmit={handleSubmit}>
                {/* ... Ici viendra le contenu du formulaire ... */}
                 <div className="mb-3">
                    <label className="form-label">Titre du poste</label>
                    <input type="text" name="title" value={jobData.title} onChange={handleChange} className="form-control" required />
                </div>
                 <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea name="description" value={jobData.description} onChange={handleChange} className="form-control" rows="5" required></textarea>
                </div>
                 <div className="mb-3">
                    <label className="form-label">Lieu</label>
                    <input type="text" name="location" value={jobData.location} onChange={handleChange} className="form-control" required />
                </div>
                 <div className="mb-3">
                    <label className="form-label">Type de contrat</label>
                    <select name="contract_type" value={jobData.contract_type} onChange={handleChange} className="form-select">
                        <option value="Full-time">Temps plein</option>
                        <option value="Part-time">Temps partiel</option>
                        <option value="Contract">Contrat</option>
                        <option value="Internship">Stage</option>
                    </select>
                </div>
                 <div className="row mb-3">
                     <div className="col">
                        <label className="form-label">Salaire (optionnel)</label>
                        <input type="number" name="salary_amount" value={jobData.salary_amount} onChange={handleChange} className="form-control" placeholder="ex: 50000" />
                    </div>
                    <div className="col">
                        <label className="form-label">Devise</label>
                        <select name="salary_currency" value={jobData.salary_currency} onChange={handleChange} className="form-select">
                            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Poster l'offre</button>
            </form>
        </div>
    );
};

export default CreateJobPage;