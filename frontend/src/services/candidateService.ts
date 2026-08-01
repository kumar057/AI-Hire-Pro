import { apiClient } from '@/services/apiClient';
import type {
  CandidateDashboardResponse,
  CandidateProfileResponse,
} from '@/types/candidateDashboard';

export const candidateService = {
  async getDashboard() {
    const response = await apiClient.get<CandidateDashboardResponse>('/candidate/dashboard');
    return response.data;
  },

  async getProfile() {
    const response = await apiClient.get<CandidateProfileResponse>('/candidate/profile');
    return response.data;
  },
};
