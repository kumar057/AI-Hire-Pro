import { apiClient } from '@/services/apiClient';
import type { ResumeAnalysisReport } from '@/types/resumeAnalysis';

export const resumeAnalysisService = {
  async analyze(resumeId = 'resume-current') {
    const response = await apiClient.post<ResumeAnalysisReport>('/ai/resume-analysis', {
      resume_id: resumeId,
    });
    return response.data;
  },

  async getReport() {
    const response = await apiClient.get<ResumeAnalysisReport>('/ai/report');
    return response.data;
  },
};

