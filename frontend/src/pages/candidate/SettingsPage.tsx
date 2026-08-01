import { CANDIDATE_PLACEHOLDERS } from '@/constants/candidateDashboard';
import { CandidatePlaceholderPage } from '@/pages/candidate/CandidatePlaceholderPage';

export function SettingsPage() {
  return <CandidatePlaceholderPage {...CANDIDATE_PLACEHOLDERS.settings} />;
}
