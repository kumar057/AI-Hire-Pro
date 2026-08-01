import { CANDIDATE_PLACEHOLDERS } from '@/constants/candidateDashboard';
import { CandidatePlaceholderPage } from '@/pages/candidate/CandidatePlaceholderPage';

export function ResumePage() {
  return <CandidatePlaceholderPage {...CANDIDATE_PLACEHOLDERS.resume} />;
}
