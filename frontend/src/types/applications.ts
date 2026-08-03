import type { JobPosting } from '@/types/jobs';

export const APPLICATION_STATUSES = [
  'Draft', 'Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled',
  'Interview Completed', 'Offer Sent', 'Offer Accepted', 'Offer Rejected',
  'Rejected', 'Withdrawn',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type ApplicationTimelineEvent = {
  id: string;
  status: ApplicationStatus;
  title: string;
  description: string;
  occurred_at: string;
  completed: boolean;
};

export type ApplicationCandidate = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  experience: string;
  skills: string[];
  match_score: number;
};

export type JobApplication = {
  id: string;
  candidate_id: string;
  company_id: string;
  job: JobPosting;
  candidate: ApplicationCandidate;
  resume_id: string;
  resume_name: string;
  cover_letter: string;
  status: ApplicationStatus;
  applied_at: string | null;
  updated_at: string;
  timeline: ApplicationTimelineEvent[];
};

export type ApplicationPayload = {
  job_id: string;
  resume_id: string;
  cover_letter: string;
  status: 'Draft' | 'Submitted';
  quick_apply: boolean;
};

export type ApplicationListResponse = { applications: JobApplication[]; total: number };
