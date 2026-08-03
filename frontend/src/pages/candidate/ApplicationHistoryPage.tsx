import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { ApplicationTimeline } from '@/components/CandidateJobs/ApplicationTimeline';
import { DashboardSkeleton } from '@/components/CandidateDashboard/DashboardSkeleton';
import { jobService } from '@/services/jobService';
import type { CandidateApplication } from '@/types/jobs';

export function ApplicationHistoryPage() {
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await jobService.getAppliedJobs();
        setApplications(response.applications);
      } catch {
        toast.error('Unable to load application history.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadHistory();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="mt-6 space-y-6">
      <header className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
        <p className="text-sm font-bold uppercase tracking-normal text-cyan-700 dark:text-cyan-300">
          Application History
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
          Status timeline
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          Review application history, timeline steps, and placeholder status movement for each
          applied role.
        </p>
      </header>
      <section className="grid gap-5 xl:grid-cols-2">
        {applications.map((application) => (
          <ApplicationTimeline application={application} key={application.id} />
        ))}
      </section>
    </div>
  );
}
