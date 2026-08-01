import { apiClient } from '@/services/apiClient';
import type { CandidateDashboardResponse } from '@/types/candidateDashboard';
import type {
  CandidateProfileApiPayload,
  CandidateProfileResponse,
} from '@/types/candidateProfile';

export const candidateService = {
  async getDashboard() {
    const response = await apiClient.get<CandidateDashboardResponse>('/candidate/dashboard');
    return response.data;
  },

  async getProfile() {
    const response = await apiClient.get<CandidateProfileResponse>('/candidate/profile');
    return response.data;
  },

  async updateProfile(payload: CandidateProfileApiPayload) {
    const response = await apiClient.put<CandidateProfileResponse>('/candidate/profile', payload);
    return response.data;
  },
};
