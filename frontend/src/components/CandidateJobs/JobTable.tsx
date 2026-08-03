import { FiBookmark, FiExternalLink, FiSend, FiTrash2 } from 'react-icons/fi';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { JobPosting } from '@/types/jobs';

type JobTableProps = {
  jobs: JobPosting[];
  mode: 'applied' | 'saved';
  onApply?: (job: JobPosting) => void;
  onRemoveSaved?: (job: JobPosting) => void;
};

export function JobTable({ jobs, mode, onApply, onRemoveSaved }: JobTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900/70">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-normal text-slate-500 dark:bg-white/5 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Match</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/10">
            {jobs.map((job) => (
              <tr className="transition hover:bg-slate-50 dark:hover:bg-white/5" key={job.id}>
                <td className="px-4 py-4">
                  <div className="font-bold text-slate-950 dark:text-white">{job.title}</div>
                  <div className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {job.employment_type} / {job.experience_level}
                  </div>
                </td>
                <td className="px-4 py-4 font-semibold text-slate-700 dark:text-slate-200">
                  {job.company}
                </td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{job.location}</td>
                <td className="px-4 py-4">
                  <Badge className="bg-cyan-50 text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-200" variant="secondary">
                    {job.match_score}%
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  <Badge variant={job.is_applied ? 'default' : 'outline'}>
                    {job.is_applied ? 'Applied' : mode === 'saved' ? 'Saved' : 'Open'}
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    {mode === 'saved' ? (
                      <>
                        <Button onClick={() => onApply?.(job)} size="sm" type="button">
                          <FiSend aria-hidden="true" />
                          Apply
                        </Button>
                        <Button onClick={() => onRemoveSaved?.(job)} size="sm" type="button" variant="outline">
                          <FiTrash2 aria-hidden="true" />
                          Remove
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" type="button" variant="outline">
                        <FiExternalLink aria-hidden="true" />
                        Details
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {jobs.length === 0 ? (
        <div className="grid min-h-40 place-items-center p-6 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
          <FiBookmark aria-hidden="true" className="mb-2 size-8 text-cyan-600 dark:text-cyan-300" />
          No jobs match these filters.
        </div>
      ) : null}
    </div>
  );
}
