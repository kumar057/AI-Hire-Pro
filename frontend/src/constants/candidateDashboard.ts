import {
  FiBell,
  FiBookmark,
  FiBriefcase,
  FiCompass,
  FiFileText,
  FiHelpCircle,
  FiHome,
  FiInbox,
  FiMessageSquare,
  FiSearch,
  FiSettings,
  FiShield,
  FiStar,
  FiTarget,
  FiUploadCloud,
  FiUser,
  FiZap,
} from 'react-icons/fi';

import type {
  CandidateActivity,
  CandidateMetric,
  CandidateNavItem,
  CandidateQuickAction,
} from '@/types/candidateDashboard';

export const CANDIDATE_NAV_ITEMS: CandidateNavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    to: '/candidate/dashboard',
    icon: FiHome,
    end: true,
  },
  {
    id: 'profile',
    label: 'My Profile',
    to: '/candidate/dashboard/profile',
    icon: FiUser,
  },
  {
    id: 'resume',
    label: 'Resume',
    to: '/candidate/dashboard/resume',
    icon: FiFileText,
  },
  {
    id: 'jobs',
    label: 'Jobs',
    to: '/candidate/dashboard/jobs',
    icon: FiBriefcase,
  },
  {
    id: 'saved-jobs',
    label: 'Saved Jobs',
    to: '/candidate/dashboard/saved-jobs',
    icon: FiBookmark,
  },
  {
    id: 'applied-jobs',
    label: 'Applied Jobs',
    to: '/candidate/dashboard/applied-jobs',
    icon: FiTarget,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    to: '/candidate/dashboard/notifications',
    icon: FiBell,
  },
  {
    id: 'messages',
    label: 'Messages',
    to: '/candidate/dashboard/messages',
    icon: FiMessageSquare,
  },
  {
    id: 'settings',
    label: 'Settings',
    to: '/candidate/dashboard/settings',
    icon: FiSettings,
  },
  {
    id: 'help',
    label: 'Help',
    to: '/candidate/dashboard/help',
    icon: FiHelpCircle,
  },
];

export const CANDIDATE_METRICS: CandidateMetric[] = [
  {
    id: 'jobs-applied',
    label: 'Jobs Applied',
    value: 18,
    helper: 'Across active searches',
    trend: '+4 this week',
    icon: FiBriefcase,
    tone: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-200',
  },
  {
    id: 'saved-jobs',
    label: 'Saved Jobs',
    value: 42,
    helper: 'Ready to review',
    trend: '+9 curated',
    icon: FiBookmark,
    tone: 'bg-amber-50 text-amber-700 dark:bg-amber-300/10 dark:text-amber-200',
  },
  {
    id: 'resume-score',
    label: 'Resume Score',
    value: 86,
    suffix: '%',
    helper: 'AI quality signal',
    trend: '+6 improved',
    icon: FiShield,
    tone: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-200',
  },
  {
    id: 'profile-completion',
    label: 'Profile Completion',
    value: 75,
    suffix: '%',
    helper: 'Dummy profile value',
    trend: '3 steps left',
    icon: FiUser,
    tone: 'bg-violet-50 text-violet-700 dark:bg-violet-300/10 dark:text-violet-200',
  },
  {
    id: 'job-matches',
    label: 'Job Matches',
    value: 128,
    helper: 'AI-ranked roles',
    trend: '+18 today',
    icon: FiStar,
    tone: 'bg-rose-50 text-rose-700 dark:bg-rose-300/10 dark:text-rose-200',
  },
  {
    id: 'interviews',
    label: 'Interviews',
    value: 4,
    helper: 'Upcoming screens',
    trend: '2 this week',
    icon: FiInbox,
    tone: 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-100',
  },
];

export const CANDIDATE_ACTIVITY: CandidateActivity[] = [
  {
    id: 'activity-1',
    title: 'Profile strength updated',
    description: 'Your candidate profile completion moved to 75%.',
    time: 'Today, 9:30 AM',
    tone: 'bg-cyan-500',
  },
  {
    id: 'activity-2',
    title: 'New AI job matches',
    description: '12 new roles match React, TypeScript, and product UI signals.',
    time: 'Today, 8:10 AM',
    tone: 'bg-emerald-500',
  },
  {
    id: 'activity-3',
    title: 'Resume placeholder reviewed',
    description: 'The dashboard is ready for future resume intelligence workflows.',
    time: 'Yesterday',
    tone: 'bg-amber-500',
  },
  {
    id: 'activity-4',
    title: 'Saved roles refreshed',
    description: 'Your saved jobs queue has updated market-fit placeholders.',
    time: 'Jul 31',
    tone: 'bg-rose-500',
  },
];

export const CANDIDATE_QUICK_ACTIONS: CandidateQuickAction[] = [
  {
    id: 'upload-resume',
    label: 'Upload Resume',
    description: 'Prepare the resume workflow entry point.',
    icon: FiUploadCloud,
    to: '/candidate/dashboard/resume',
    tone: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'complete-profile',
    label: 'Complete Profile',
    description: 'Open profile setup and candidate basics.',
    icon: FiUser,
    to: '/candidate/dashboard/profile',
    tone: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'find-jobs',
    label: 'Find Jobs',
    description: 'Browse placeholder job discovery.',
    icon: FiSearch,
    to: '/candidate/dashboard/jobs',
    tone: 'from-amber-500 to-orange-600',
  },
  {
    id: 'ai-resume-review',
    label: 'AI Resume Review',
    description: 'Reserve space for AI coaching.',
    icon: FiZap,
    to: '/candidate/dashboard/resume',
    tone: 'from-fuchsia-500 to-rose-600',
  },
];

export const CANDIDATE_MATCH_TREND = [
  { label: 'Mon', matches: 38 },
  { label: 'Tue', matches: 52 },
  { label: 'Wed', matches: 49 },
  { label: 'Thu', matches: 68 },
  { label: 'Fri', matches: 84 },
  { label: 'Sat', matches: 92 },
  { label: 'Sun', matches: 128 },
];

export const CANDIDATE_PLACEHOLDERS = {
  profile: {
    title: 'My Profile',
    description:
      'Candidate identity, contact details, career preferences, and profile quality controls will live here.',
    icon: FiUser,
  },
  resume: {
    title: 'Resume',
    description:
      'Resume management, parsing status, versions, and future AI resume review workflows will live here.',
    icon: FiFileText,
  },
  jobs: {
    title: 'Jobs',
    description:
      'Candidate job search, filters, recommendations, and discovery controls will live here.',
    icon: FiCompass,
  },
  savedJobs: {
    title: 'Saved Jobs',
    description:
      'Bookmarked roles, saved searches, and candidate follow-up planning will live here.',
    icon: FiBookmark,
  },
  appliedJobs: {
    title: 'Applied Jobs',
    description:
      'Application status, timelines, interview tracking, and recruiter updates will live here.',
    icon: FiTarget,
  },
  notifications: {
    title: 'Notifications',
    description:
      'Candidate alerts, job-match updates, and account notifications will live here.',
    icon: FiBell,
  },
  messages: {
    title: 'Messages',
    description:
      'Recruiter conversations, interview coordination, and message threads will live here.',
    icon: FiMessageSquare,
  },
  settings: {
    title: 'Settings',
    description:
      'Account preferences, privacy settings, security options, and notification controls will live here.',
    icon: FiSettings,
  },
  help: {
    title: 'Help',
    description:
      'Support resources, onboarding guidance, FAQs, and contact options will live here.',
    icon: FiHelpCircle,
  },
} as const;
