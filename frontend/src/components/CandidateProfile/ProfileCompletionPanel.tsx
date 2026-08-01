import { CircularProgress } from '@/components/CandidateDashboard/CircularProgress';

type ProfileCompletionPanelProps = {
  completion: number;
};

export function ProfileCompletionPanel({ completion }: ProfileCompletionPanelProps) {
  const helper =
    completion >= 90
      ? 'Excellent profile depth for future matching workflows.'
      : 'Add skills, links, and experience to improve your candidate signal.';

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20">
      <CircularProgress label="Profile Completion" value={completion} />
      <div className="mt-5 rounded-lg bg-slate-50 p-4 dark:bg-white/5">
        <p className="text-sm font-bold text-slate-950 dark:text-white">Live completion score</p>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{helper}</p>
      </div>
    </aside>
  );
}
