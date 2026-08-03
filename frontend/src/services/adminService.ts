import { apiClient } from '@/services/apiClient';
import type { AdminCollection, AdminDashboard, AdminReports } from '@/types/admin';

export const adminService = {
  async getDashboard() { return (await apiClient.get<AdminDashboard>('/admin/dashboard')).data; },
  async getUsers() { return (await apiClient.get<AdminCollection>('/admin/users')).data; },
  async getCompanies() { return (await apiClient.get<AdminCollection>('/admin/companies')).data; },
  async getJobs() { return (await apiClient.get<AdminCollection>('/admin/jobs')).data; },
  async getApplications() { return (await apiClient.get<AdminCollection>('/admin/applications')).data; },
  async getReports() { return (await apiClient.get<AdminReports>('/admin/reports')).data; },
};
