import React from 'react';
import { Link } from 'react-router-dom';
import styles from './JobCard.module.css';
import { FaMapMarkerAlt, FaRegClock, FaMoneyBillWave } from 'react-icons/fa';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const JobCard = ({ job }) => {
    // Affiche "il y a 3 jours" au lieu d'une date complète
    const timeAgo = formatDistanceToNow(parseISO(job.posted_at), { addSuffix: true, locale: fr });

    // Les deux premières lettres du nom du recruteur pour le logo
    const logoInitials = job.recruiter.name.substring(0, 2).toUpperCase();
    
    return (
        <div className={styles.jobCard}>
            {/* EN-TÊTE AVEC LOGO ET TITRE */}
            <header className={styles.header}>
                <div className={styles.logo}>
                    {logoInitials}
                </div>
                <div>
                    <Link to={`/jobs/${job.id}`} className={styles.title}>
                        {job.title}
                    </Link>
                    <p className={styles.company}>
                        {job.recruiter.name}
                    </p>
                </div>
            </header>

            {/* SECTION DES TAGS D'INFORMATIONS */}
            <div className={styles.tags}>
                <div className={styles.tag}>
                    <FaMapMarkerAlt />
                    <span>{job.location}</span>
                </div>
                <div className={styles.tag}>
                    <FaRegClock />
                    <span>{job.contract_type}</span>
                </div>
                {job.salary_amount && (
                    <div className={styles.tag}>
                        <FaMoneyBillWave />
                        <span>{job.salary_amount} {job.salary_currency}</span>
                    </div>
                )}
            </div>

            {/* PIED DE CARTE AVEC DATE ET BOUTON */}
            <footer className={styles.footer}>
                <span className={styles.postedDate}>
                    Publié {timeAgo}
                </span>
                <Link to={`/jobs/${job.id}`} className={styles.detailsButton}>
                    Voir l'offre
                </Link>
            </footer>
        </div>
    );
};

export default JobCard;