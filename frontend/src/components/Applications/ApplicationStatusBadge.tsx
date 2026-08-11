import type { ApplicationStatus } from '@/types/applications';

const colors: Record<ApplicationStatus, string> = {
  Draft: 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200',
  Submitted: 'bg-blue-50 text-blue-700 dark:bg-blue-300/10 dark:text-blue-200',
  'Under Review': 'bg-amber-50 text-amber-700 dark:bg-amber-300/10 dark:text-amber-200',
  Shortlisted: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-200',
  'Interview Scheduled': 'bg-violet-50 text-violet-700 dark:bg-violet-300/10 dark:text-violet-200',
  'Interview Completed': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-300/10 dark:text-indigo-200',
  'Offer Sent': 'bg-teal-50 text-teal-700 dark:bg-teal-300/10 dark:text-teal-200',
  'Offer Accepted': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-200',
  'Offer Rejected': 'bg-orange-50 text-orange-700 dark:bg-orange-300/10 dark:text-orange-200',
  Rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-300/10 dark:text-rose-200',
  Withdrawn: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-300/10 dark:text-zinc-200',
};

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${colors[status]}`}>{status}</span>;
}
