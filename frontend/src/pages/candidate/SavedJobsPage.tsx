import { CANDIDATE_PLACEHOLDERS } from '@/constants/candidateDashboard';
import { CandidatePlaceholderPage } from '@/pages/candidate/CandidatePlaceholderPage';

export function SavedJobsPage() {
  return <CandidatePlaceholderPage {...CANDIDATE_PLACEHOLDERS.savedJobs} />;
}
