import { apiClient } from '@/services/apiClient';
import type {
  CandidateAppliedJobsResponse,
  JobActionResponse,
  JobListResponse,
  JobQuery,
} from '@/types/jobs';

export const jobService = {
  async getJobs(query: JobQuery = {}) {
    const response = await apiClient.get<JobListResponse>('/jobs', { params: query });
    return response.data;
  },

  async getSavedJobs() {
    const response = await apiClient.get<JobListResponse>('/candidate/saved-jobs');
    return response.data;
  },

  async getAppliedJobs() {
    const response = await apiClient.get<CandidateAppliedJobsResponse>('/candidate/applied-jobs');
    return response.data;
  },

  async saveJob(jobId: string) {
    const response = await apiClient.post<JobActionResponse>('/candidate/save-job', {
      job_id: jobId,
    });
    return response.data;
  },

  async applyJob(jobId: string) {
    const response = await apiClient.post<JobActionResponse>('/candidate/apply-job', {
      job_id: jobId,
    });
    return response.data;
  },
};
