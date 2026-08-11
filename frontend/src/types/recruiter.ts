import type { ApplicationTimelineEvent } from '@/types/applications';

export const PIPELINE_STAGES = ['Applied', 'Screening', 'Shortlisted', 'Technical Interview', 'HR Interview', 'Final Review', 'Offer', 'Hired', 'Rejected'] as const;
export type PipelineStage = (typeof PIPELINE_STAGES)[number];
export type RecruiterNote = { id: string; author: string; content: string; created_at: string };
export type RecruiterCandidate = {
  id: string; application_id: string; name: string; email: string; phone: string;
  location: string; headline: string; experience: string; education: string[];
  certifications: string[]; skills: string[]; portfolio_url: string | null;
  github_url: string | null; linkedin_url: string | null; job_id: string;
  job_title: string; status: PipelineStage; rating: number; tags: string[];
  bookmarked: boolean; resume_name: string; cover_letter: string; applied_at: string;
  notes: RecruiterNote[]; timeline: ApplicationTimelineEvent[];
};
export type RecruiterCandidateList = { candidates: RecruiterCandidate[]; total: number };
export type RecruiterCandidateUpdate = { candidate_id: string; message: string; candidate: RecruiterCandidate };
