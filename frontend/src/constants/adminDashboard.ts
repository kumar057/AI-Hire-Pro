import { FiActivity, FiBarChart2, FiBell, FiBriefcase, FiCpu, FiFileText, FiFlag, FiHelpCircle, FiHome, FiMessageCircle, FiSettings, FiShield, FiStar, FiUsers } from 'react-icons/fi';
import type { AdminNavItem } from '@/types/admin';

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', to: '/admin/dashboard', icon: FiHome, end: true },
  { id: 'users', label: 'User Management', to: '/admin/dashboard/users', icon: FiUsers },
  { id: 'companies', label: 'Company Management', to: '/admin/dashboard/companies', icon: FiShield },
  { id: 'jobs', label: 'Job Management', to: '/admin/dashboard/jobs', icon: FiBriefcase },
  { id: 'applications', label: 'Applications', to: '/admin/dashboard/applications', icon: FiFileText },
  { id: 'reports', label: 'Reports', to: '/admin/dashboard/reports', icon: FiFlag },
  { id: 'analytics', label: 'Analytics', to: '/admin/dashboard/analytics', icon: FiBarChart2 },
  { id: 'notifications', label: 'Notifications', to: '/admin/dashboard/notifications', icon: FiBell },
  { id: 'activity', label: 'Activity Logs', to: '/admin/dashboard/activity', icon: FiActivity },
  { id: 'audit', label: 'Audit Logs', to: '/admin/dashboard/audit', icon: FiShield },
  { id: 'support', label: 'Support Tickets', to: '/admin/dashboard/support', icon: FiHelpCircle },
  { id: 'feedback', label: 'Feedback', to: '/admin/dashboard/feedback', icon: FiMessageCircle },
  { id: 'ai-settings', label: 'AI Settings', to: '/admin/dashboard/ai-settings', icon: FiCpu },
  { id: 'settings', label: 'System Settings', to: '/admin/dashboard/settings', icon: FiSettings },
];

export const ADMIN_METRICS = [
  { key: 'total_users', label: 'Total Users', icon: FiUsers, tone: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-200' },
  { key: 'candidates', label: 'Candidates', icon: FiStar, tone: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-200' },
  { key: 'companies', label: 'Companies', icon: FiShield, tone: 'bg-violet-50 text-violet-700 dark:bg-violet-300/10 dark:text-violet-200' },
  { key: 'jobs', label: 'Jobs', icon: FiBriefcase, tone: 'bg-amber-50 text-amber-700 dark:bg-amber-300/10 dark:text-amber-200' },
  { key: 'applications', label: 'Applications', icon: FiFileText, tone: 'bg-rose-50 text-rose-700 dark:bg-rose-300/10 dark:text-rose-200' },
  { key: 'revenue', label: 'Revenue', icon: FiBarChart2, prefix: '$', tone: 'bg-blue-50 text-blue-700 dark:bg-blue-300/10 dark:text-blue-200' },
  { key: 'daily_active_users', label: 'Daily Active Users', icon: FiActivity, tone: 'bg-teal-50 text-teal-700 dark:bg-teal-300/10 dark:text-teal-200' },
  { key: 'system_health', label: 'System Health', icon: FiCpu, tone: 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200' },
] as const;

