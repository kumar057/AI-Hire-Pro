import { CANDIDATE_PLACEHOLDERS } from '@/constants/candidateDashboard';
import { CandidatePlaceholderPage } from '@/pages/candidate/CandidatePlaceholderPage';

export function AppliedJobsPage() {
  return <CandidatePlaceholderPage {...CANDIDATE_PLACEHOLDERS.appliedJobs} />;
}
