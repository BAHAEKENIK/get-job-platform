import apiClient from './apiClient';

const ApplicationService = {
    apply: (jobId, formData) => {
        return apiClient.post(`/jobs/${jobId}/apply`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    getMyApplications: () => {
        return apiClient.get('/my-applications');
    },
    updateApplicationStatus: (applicationId, status) => {
        return apiClient.patch(`/applications/${applicationId}/status`, { status });
    }
};

export default ApplicationService;