import React, { useState, useEffect } from 'react';
import JobService from '../services/JobService';
import JobCard from '../components/JobCard';

const JobsListPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State pour les filtres de recherche
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const params = { keyword, location };
            const response = await JobService.getAllJobs(params);
            setJobs(response.data.data); // Laravel pagination nests results in 'data'
        } catch (err) {
            setError('Impossible de charger les offres d\'emploi.');
        } finally {
            setLoading(false);
        }
    };
    
    // Charger les données au premier affichage
    useEffect(() => {
        fetchJobs();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    return (
        <div className="container">
            <h1 className="my-4">Trouver une offre d'emploi</h1>

            {/* Barre de recherche */}
            <form onSubmit={handleSearch} className="row g-3 mb-4">
                <div className="col-md-5">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Mot-clé (ex: Développeur React)"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
                <div className="col-md-5">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Lieu (ex: Paris)"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
                <div className="col-md-2">
                    <button type="submit" className="btn btn-primary w-100">Rechercher</button>
                </div>
            </form>

            {loading && <p>Chargement des offres...</p>}
            {error && <div className="alert alert-danger">{error}</div>}
            
            {!loading && !error && (
                <div>
                    {jobs.length > 0 ? (
                        jobs.map(job => <JobCard key={job.id} job={job} />)
                    ) : (
                        <p>Aucune offre d'emploi ne correspond à votre recherche.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobsListPage;