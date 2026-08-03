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

  async searchJobs(query: string, page = 1) {
    const response = await apiClient.get<JobListResponse>('/jobs/search', {
      params: { q: query, page, page_size: 50 },
    });
    return response.data;
  },

  async getJob(jobId: string) {
    const response = await apiClient.get<import('@/types/jobs').JobPosting>(`/jobs/${jobId}`);
    return response.data;
  },

  async getFeaturedJobs() {
    const response = await apiClient.get<JobListResponse>('/jobs/featured');
    return response.data;
  },

  async getSimilarJobs(jobId: string) {
    const response = await apiClient.get<JobListResponse>(`/jobs/similar/${jobId}`);
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
