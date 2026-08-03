export const MODERATION_STATUSES = ['Pending', 'Approved', 'Rejected', 'Flagged', 'Suspended', 'Archived', 'Deleted'] as const;
export type ModerationStatus = (typeof MODERATION_STATUSES)[number];
export type ModerationNote = { id: string; author: string; content: string; created_at: string };
export type ModerationJob = { id: string; title: string; company: string; company_id: string; company_verified: boolean; company_violations: number; category: string; location: string; employment_type: string; salary: string; skills: string[]; description: string; benefits: string[]; posting_date: string; status: ModerationStatus; report_count: number; bookmarked: boolean; moderation_notes: ModerationNote[] };
export type ModerationJobList = { jobs: ModerationJob[]; total: number; status_counts: Record<string, number> };
export type JobReport = { id: string; job_id: string; job_title: string; company: string; reason: string; reporter: string; report_date: string; status: string; resolution: string };
export type CompanyViolation = { id: string; company: string; violation: string; severity: string; date: string; status: string };
export type ModerationHistoryItem = { id: string; job_id: string; job_title: string; action: string; moderator: string; occurred_at: string; note: string };
