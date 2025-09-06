import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5 className="card-title">{job.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{job.recruiter.name}</h6>
                <p className="card-text">
                    <strong>Lieu:</strong> {job.location} <br/>
                    <strong>Type de contrat:</strong> {job.contract_type}
                </p>
                {job.salary_amount && (
                     <p className="card-text">
                        <strong>Salaire:</strong> {job.salary_amount} {job.salary_currency}
                    </p>
                )}
                <Link to={`/jobs/${job.id}`} className="btn btn-primary">
                    Voir les détails
                </Link>
            </div>
        </div>
    );
};

export default JobCard;