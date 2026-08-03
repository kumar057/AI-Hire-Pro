import { CANDIDATE_PLACEHOLDERS } from '@/constants/candidateDashboard';
import { CandidatePlaceholderPage } from '@/pages/candidate/CandidatePlaceholderPage';

export function MessagesPage() {
  return <CandidatePlaceholderPage {...CANDIDATE_PLACEHOLDERS.messages} />;
}
