import { apiClient } from '@/services/apiClient';
import type { AdminCollection, AdminDashboard, AdminReports } from '@/types/admin';
import type { CompanyViolation, JobReport, ModerationHistoryItem, ModerationJob, ModerationJobList } from '@/types/moderation';

export const adminService = {
  async getDashboard() { return (await apiClient.get<AdminDashboard>('/admin/dashboard')).data; },
  async getUsers() { return (await apiClient.get<AdminCollection>('/admin/users')).data; },
  async getCompanies() { return (await apiClient.get<AdminCollection>('/admin/companies')).data; },
  async getJobs() { return (await apiClient.get<ModerationJobList>('/admin/jobs')).data; },
  async getJob(id: string) { return (await apiClient.get<ModerationJob>(`/admin/jobs/${id}`)).data; },
  async moderateJob(id: string, action: 'approve' | 'reject' | 'suspend' | 'archive' | 'restore' | 'request-changes', reason = '') { return (await apiClient.patch<ModerationJob>(`/admin/jobs/${id}/${action}`, { reason })).data; },
  async addJobNote(id: string, content: string) { return (await apiClient.post<ModerationJob>(`/admin/jobs/${id}/notes`, { content })).data; },
  async getJobReports() { return (await apiClient.get<{ reports: JobReport[]; total: number }>('/admin/job-reports')).data; },
  async getCompanyViolations() { return (await apiClient.get<CompanyViolation[]>('/admin/company-violations')).data; },
  async getModerationHistory() { return (await apiClient.get<ModerationHistoryItem[]>('/admin/moderation-history')).data; },
  async getApplications() { return (await apiClient.get<AdminCollection>('/admin/applications')).data; },
  async getReports() { return (await apiClient.get<AdminReports>('/admin/reports')).data; },
};
