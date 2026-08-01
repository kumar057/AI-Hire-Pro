import { CANDIDATE_PLACEHOLDERS } from '@/constants/candidateDashboard';
import { CandidatePlaceholderPage } from '@/pages/candidate/CandidatePlaceholderPage';

export function JobsPage() {
  return <CandidatePlaceholderPage {...CANDIDATE_PLACEHOLDERS.jobs} />;
}
