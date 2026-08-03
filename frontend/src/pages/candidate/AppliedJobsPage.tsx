import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { ApplicationChart } from '@/components/CandidateJobs/ApplicationChart';
import { JobPagination } from '@/components/CandidateJobs/JobPagination';
import { JobTable } from '@/components/CandidateJobs/JobTable';
import { JobToolbar } from '@/components/CandidateJobs/JobToolbar';
import { DashboardSkeleton } from '@/components/CandidateDashboard/DashboardSkeleton';
import { JOBS_PAGE_SIZE } from '@/constants/jobs';
import { jobService } from '@/services/jobService';
import type { CandidateApplication } from '@/types/jobs';
import { filterJobs, paginateJobs } from '@/utils/jobs';

export function AppliedJobsPage() {
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [chart, setChart] = useState<Array<{ applications: number; label: string }>>([]);
  const [employmentType, setEmploymentType] = useState('All Types');
  const [location, setLocation] = useState('All Locations');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('match');
  const [workMode, setWorkMode] = useState('All Modes');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAppliedJobs() {
      try {
        const response = await jobService.getAppliedJobs();
        setApplications(response.applications);
        setChart(response.chart);
      } catch {
        toast.error('Unable to load applied jobs.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadAppliedJobs();
  }, []);

  const jobs = useMemo(
    () =>
      applications.map((application) => ({
        ...application.job,
        is_applied: true,
      })),
    [applications],
  );
  const filteredJobs = useMemo(
    () => filterJobs(jobs, { employmentType, location, search, sort, workMode }),
    [employmentType, jobs, location, search, sort, workMode],
  );
  const visibleJobs = paginateJobs(filteredJobs, page, JOBS_PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [employmentType, location, search, sort, workMode]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="mt-6 space-y-6">
      <header className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
        <p className="text-sm font-bold uppercase tracking-normal text-cyan-700 dark:text-cyan-300">
          Applied Jobs
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
          Application workspace
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          Track applied jobs, current placeholder statuses, and application volume.
        </p>
      </header>
      <ApplicationChart data={chart} />
      <JobToolbar
        employmentType={employmentType}
        location={location}
        onEmploymentTypeChange={setEmploymentType}
        onLocationChange={setLocation}
        onSearchChange={setSearch}
        onSortChange={setSort}
        onWorkModeChange={setWorkMode}
        search={search}
        sort={sort}
        workMode={workMode}
      />
      <JobTable jobs={visibleJobs} mode="applied" />
      <JobPagination onPageChange={setPage} page={page} pageSize={JOBS_PAGE_SIZE} total={filteredJobs.length} />
    </div>
  );
}
