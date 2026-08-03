import type { IconType } from 'react-icons';

export type CandidateMetric = {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  helper: string;
  trend: string;
  icon: IconType;
  tone: string;
};

export type CandidateActivity = {
  id: string;
  title: string;
  description: string;
  time: string;
  tone: string;
};

export type CandidateQuickAction = {
  id: string;
  label: string;
  description: string;
  icon: IconType;
  to: string;
  tone: string;
};

export type CandidateNavItem = {
  id: string;
  label: string;
  to: string;
  icon: IconType;
  end?: boolean;
};

export type CandidateDashboardSummary = {
  jobs_applied: number;
  saved_jobs: number;
  resume_score: number;
  profile_completion: number;
  job_matches: number;
  interviews: number;
};

export type CandidateDashboardResponse = {
  user_id: string;
  summary: CandidateDashboardSummary;
  recent_activity: Array<{
    id: string;
    title: string;
    description: string;
    occurred_at: string;
  }>;
};

export type CandidateProfileResponse = {
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  headline: string;
  location: string;
  profile_completion: number;
  skills: string[];
};
