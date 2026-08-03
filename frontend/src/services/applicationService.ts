import { apiClient } from '@/services/apiClient';
import type {
  ApplicationListResponse,
  ApplicationPayload,
  ApplicationStatus,
  JobApplication,
} from '@/types/applications';

export const applicationService = {
  async create(payload: ApplicationPayload) {
    return (await apiClient.post<JobApplication>('/applications', payload)).data;
  },
  async getCandidateApplications() {
    return (await apiClient.get<ApplicationListResponse>('/candidate/applications')).data;
  },
  async getCompanyApplications() {
    return (await apiClient.get<ApplicationListResponse>('/company/applications')).data;
  },
  async getApplication(id: string) {
    return (await apiClient.get<JobApplication>(`/applications/${id}`)).data;
  },
  async updateStatus(id: string, status: ApplicationStatus, note = '') {
    return (
      await apiClient.patch<JobApplication>(`/applications/${id}/status`, { status, note })
    ).data;
  },
  async withdraw(id: string) {
    return (
      await apiClient.delete<{ id: string; status: 'Withdrawn'; message: string }>(
        `/applications/${id}`,
      )
    ).data;
  },
};
