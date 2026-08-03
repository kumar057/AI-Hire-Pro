import {
  FiBarChart2,
  FiBell,
  FiBriefcase,
  FiCalendar,
  FiCreditCard,
  FiFilePlus,
  FiHelpCircle,
  FiHome,
  FiMessageSquare,
  FiSettings,
  FiUserCheck,
  FiUsers,
} from 'react-icons/fi';

import type { CompanyNavItem } from '@/types/company';

export const COMPANY_NAV_ITEMS: CompanyNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', to: '/company/dashboard', icon: FiHome, end: true },
  { id: 'profile', label: 'Company Profile', to: '/company/dashboard/profile', icon: FiUsers },
  { id: 'post-job', label: 'Post Job', to: '/company/dashboard/post-job', icon: FiFilePlus },
  { id: 'manage-jobs', label: 'Manage Jobs', to: '/company/dashboard/jobs', icon: FiBriefcase },
  { id: 'applicants', label: 'Applicants', to: '/company/dashboard/applicants', icon: FiUserCheck },
  { id: 'interviews', label: 'Interviews', to: '/company/dashboard/interviews', icon: FiCalendar },
  { id: 'messages', label: 'Messages', to: '/company/dashboard/messages', icon: FiMessageSquare },
  { id: 'notifications', label: 'Notifications', to: '/company/dashboard/notifications', icon: FiBell },
  { id: 'analytics', label: 'Analytics', to: '/company/dashboard/analytics', icon: FiBarChart2 },
  { id: 'subscription', label: 'Subscription', to: '/company/dashboard/subscription', icon: FiCreditCard },
  { id: 'settings', label: 'Settings', to: '/company/dashboard/settings', icon: FiSettings },
  { id: 'help', label: 'Help', to: '/company/dashboard/help', icon: FiHelpCircle },
];

export const COMPANY_METRICS = [
  { key: 'total_jobs', label: 'Total Jobs', helper: 'All job posts', icon: FiBriefcase, tone: 'text-cyan-700 bg-cyan-50 dark:text-cyan-200 dark:bg-cyan-300/10' },
  { key: 'active_jobs', label: 'Active Jobs', helper: 'Currently hiring', icon: FiFilePlus, tone: 'text-emerald-700 bg-emerald-50 dark:text-emerald-200 dark:bg-emerald-300/10' },
  { key: 'applications', label: 'Applications', helper: 'Across all roles', icon: FiUsers, tone: 'text-violet-700 bg-violet-50 dark:text-violet-200 dark:bg-violet-300/10' },
  { key: 'interviews', label: 'Interviews', helper: 'Scheduled sessions', icon: FiCalendar, tone: 'text-amber-700 bg-amber-50 dark:text-amber-200 dark:bg-amber-300/10' },
  { key: 'hired_candidates', label: 'Hired', helper: 'Successful placements', icon: FiUserCheck, tone: 'text-rose-700 bg-rose-50 dark:text-rose-200 dark:bg-rose-300/10' },
  { key: 'company_views', label: 'Company Views', helper: 'This month', icon: FiBarChart2, tone: 'text-blue-700 bg-blue-50 dark:text-blue-200 dark:bg-blue-300/10' },
] as const;

