import { CANDIDATE_PLACEHOLDERS } from '@/constants/candidateDashboard';
import { CandidatePlaceholderPage } from '@/pages/candidate/CandidatePlaceholderPage';

export function MyProfilePage() {
  return <CandidatePlaceholderPage {...CANDIDATE_PLACEHOLDERS.profile} />;
}
