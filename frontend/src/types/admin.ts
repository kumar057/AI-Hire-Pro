import type { IconType } from 'react-icons';

export interface AdminNavItem { id: string; label: string; to: string; icon: IconType; end?: boolean }
export interface AdminDashboard {
  summary: Record<string, number | string>;
  user_growth: Array<Record<string, number | string>>;
  job_growth: Array<Record<string, number | string>>;
  application_trend: Array<Record<string, number | string>>;
  top_companies: Array<Record<string, number | string>>;
  most_applied_jobs: Array<Record<string, number | string>>;
  active_users: Array<Record<string, number | string>>;
}
export interface AdminCollection { items: AdminRecord[]; total: number }
export type AdminRecord = { id: string } & Record<string, string | number>;
export interface AdminReports { reports: AdminRecord[]; generated_at: string }

