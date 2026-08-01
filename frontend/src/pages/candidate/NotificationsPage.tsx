import { CANDIDATE_PLACEHOLDERS } from '@/constants/candidateDashboard';
import { CandidatePlaceholderPage } from '@/pages/candidate/CandidatePlaceholderPage';

export function NotificationsPage() {
  return <CandidatePlaceholderPage {...CANDIDATE_PLACEHOLDERS.notifications} />;
}
