import { apiClient } from '@/services/apiClient';
import type {
  CompanyAnalytics,
  CompanyApplicant,
  CompanyDashboardResponse,
  CompanyJob,
  CompanyJobAnalytics,
  CompanyProfile,
} from '@/types/company';

export const companyService = {
  async getDashboard() {
    return (await apiClient.get<CompanyDashboardResponse>('/company/dashboard')).data;
  },
  async getProfile() {
    return (await apiClient.get<CompanyProfile>('/company/profile')).data;
  },
  async updateProfile(payload: CompanyProfile) {
    return (await apiClient.put<CompanyProfile>('/company/profile', payload)).data;
  },
  async createJob(payload: CompanyJob) {
    return (await apiClient.post<CompanyJob>('/company/jobs', payload)).data;
  },
  async getJobs() {
    return (await apiClient.get<{ jobs: CompanyJob[]; total: number }>('/company/jobs')).data;
  },
  async getJob(id: string) {
    return (await apiClient.get<CompanyJob>(`/company/jobs/${id}`)).data;
  },
  async updateJob(id: string, payload: CompanyJob) {
    return (await apiClient.put<CompanyJob>(`/company/jobs/${id}`, payload)).data;
  },
  async deleteJob(id: string) {
    return (await apiClient.delete<{ id: string; status: string }>(`/company/jobs/${id}`)).data;
  },
  async setJobPublished(id: string, published: boolean) {
    return (
      await apiClient.patch<CompanyJob>(`/company/jobs/${id}/publish`, { published })
    ).data;
  },
  async archiveJob(id: string) {
    return (await apiClient.patch<CompanyJob>(`/company/jobs/${id}/archive`)).data;
  },
  async getJobAnalytics(id: string) {
    return (await apiClient.get<CompanyJobAnalytics>(`/company/jobs/${id}/analytics`)).data;
  },
  async getApplicants() {
    return (await apiClient.get<{ applicants: CompanyApplicant[]; total: number }>('/company/applicants')).data;
  },
  async getAnalytics() {
    return (await apiClient.get<CompanyAnalytics>('/company/analytics')).data;
  },
};
