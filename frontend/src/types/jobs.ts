export type JobPosting = {
  id: string;
  title: string;
  company: string;
  location: string;
  work_mode: string;
  employment_type: string;
  salary_range: string;
  match_score: number;
  posted_at: string;
  experience_level: string;
  skills: string[];
  is_saved: boolean;
  is_applied: boolean;
  description: string;
};

export type JobListResponse = {
  jobs: JobPosting[];
  total: number;
  page: number;
  page_size: number;
};

export type ApplicationTimelineItem = {
  id: string;
  label: string;
  description: string;
  occurred_at: string;
  status: 'active' | 'complete' | 'pending';
};

export type CandidateApplication = {
  id: string;
  job: JobPosting;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Review';
  applied_at: string;
  updated_at: string;
  timeline: ApplicationTimelineItem[];
};

export type CandidateAppliedJobsResponse = {
  applications: CandidateApplication[];
  total: number;
  status_counts: Record<string, number>;
  chart: Array<{ applications: number; label: string }>;
};

export type JobQuery = {
  location?: string;
  page?: number;
  page_size?: number;
  search?: string;
  sort?: string;
};

export type JobActionResponse = {
  job_id: string;
  status: string;
  message: string;
};
