import apiClient from './apiClient';

const ApplicationService = {
    /**
     * Postule à une offre d'emploi avec un CV.
     * @param {number} jobId L'ID de l'offre d'emploi
     * @param {FormData} formData L'objet FormData contenant le fichier CV
     */
    apply: (jobId, formData) => {
        // Pour l'envoi de fichiers, il faut s'assurer que l'en-tête est correct.
        // axios le fait automatiquement si on lui passe un objet FormData.
        return apiClient.post(`/jobs/${jobId}/apply`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    getMyApplications:()=>{
        return apiClient.get('/my-applications');
    }
};

export default ApplicationService;