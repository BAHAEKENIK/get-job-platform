import apiClient from './apiClient';

const JobService={
    getAllJobs:(params)=>{
        return apiClient.get('/jobs',{params});
    },
    getJobById:(id)=>{
        return apiClient.get(`/jobs/${id}`);
    },
    // --- NOUVELLES FONCTIONS ---
    createJob: (jobData) => apiClient.post('/jobs', jobData),
    updateJob: (id, jobData) => apiClient.put(`/jobs/${id}`, jobData),
    deleteJob: (id) => apiClient.delete(`/jobs/${id}`),
    getMyJobs: () => apiClient.get('/my-jobs'),
    getApplicantsForJob: (jobId) => {
        return apiClient.get(`/jobs/${jobId}/applications`);
    },
    
}
export default JobService;