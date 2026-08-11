import type { IconType } from 'react-icons';

export interface CompanyNavItem {
  id: string;
  label: string;
  to: string;
  icon: IconType;
  end?: boolean;
}

export interface CompanyDashboardSummary {
  total_jobs: number;
  active_jobs: number;
  applications: number;
  interviews: number;
  hired_candidates: number;
  company_views: number;
  premium_status: string;
  monthly_growth: number;
}

export interface CompanyDashboardResponse {
  company_id: string;
  company_name: string;
  summary: CompanyDashboardSummary;
  activity: Array<{ title: string; time: string }>;
}

export interface CompanyProfile {
  uuid?: string;
  company_name: string;
  industry: string;
  company_size: string;
  website: string;
  location: string;
  founded_year: number;
  description: string;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  benefits: string[];
  culture: string[];
  logo_url?: string | null;
}

export interface CompanyJob {
  id?: string;
  title: string;
  company: string;
  department: string;
  employment_type: string;
  experience_level: string;
  salary_range: string;
  location: string;
  work_mode: string;
  skills: string[];
  preferred_skills: string[];
  education: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  openings: number;
  category: string;
  tags: string[];
  application_deadline: string;
  status: CompanyJobStatus;
  applications?: number;
  views?: number;
  created_at?: string;
}

export type CompanyJobStatus = 'archived' | 'closed' | 'draft' | 'published';

export interface CompanyJobAnalytics {
  job_id: string;
  views: number;
  applications: number;
  shortlisted: number;
  interviews: number;
  conversion_rate: number;
  trend: Array<{ label: string; views: number; applications: number }>;
}

export interface CompanyApplicant {
  id: string;
  name: string;
  role: string;
  experience: string;
  location: string;
  match_score: number;
  status: string;
  applied_at: string;
  skills: string[];
}

export interface CompanyAnalytics {
  applications_trend: Array<{ label: string; applications: number; views: number }>;
  hiring_funnel: Array<{ stage: string; value: number }>;
  job_performance: Array<{ name: string; views: number; applications: number }>;
}
