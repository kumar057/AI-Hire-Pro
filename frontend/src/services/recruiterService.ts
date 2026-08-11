import { apiClient } from '@/services/apiClient';
import type { PipelineStage, RecruiterCandidate, RecruiterCandidateList, RecruiterCandidateUpdate } from '@/types/recruiter';

export const recruiterService = {
  async getCandidates() { return (await apiClient.get<RecruiterCandidateList>('/company/candidates')).data; },
  async getCandidate(id: string) { return (await apiClient.get<RecruiterCandidate>(`/company/candidates/${id}`)).data; },
  async updateStatus(id: string, status: PipelineStage) { return (await apiClient.patch<RecruiterCandidateUpdate>(`/company/candidates/${id}/status`, { status })).data; },
  async addNote(id: string, content: string) { return (await apiClient.post<RecruiterCandidateUpdate>(`/company/candidates/${id}/notes`, { content })).data; },
  async rate(id: string, rating: number) { return (await apiClient.post<RecruiterCandidateUpdate>(`/company/candidates/${id}/rating`, { rating })).data; },
};
