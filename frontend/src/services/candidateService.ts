import { apiClient } from '@/services/apiClient';
import type { CandidateDashboardResponse } from '@/types/candidateDashboard';
import type {
  CandidateProfileApiPayload,
  CandidateProfileResponse,
} from '@/types/candidateProfile';
import type { CandidateResumeResponse } from '@/types/candidateResume';

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

  async getResume() {
    const response = await apiClient.get<CandidateResumeResponse>('/candidate/resume');
    return response.data;
  },

  async uploadResume(file: File, onUploadProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<CandidateResumeResponse>('/candidate/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (event) => {
        if (event.total) {
          onUploadProgress?.(Math.round((event.loaded / event.total) * 100));
        }
      },
    });

    return response.data;
  },

  async deleteResume() {
    const response = await apiClient.delete<CandidateResumeResponse>('/candidate/resume');
    return response.data;
  },
};
