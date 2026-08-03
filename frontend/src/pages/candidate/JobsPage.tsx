import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { JobCard } from '@/components/CandidateJobs/JobCard';
import { JobPagination } from '@/components/CandidateJobs/JobPagination';
import { JobToolbar } from '@/components/CandidateJobs/JobToolbar';
import { DashboardSkeleton } from '@/components/CandidateDashboard/DashboardSkeleton';
import { JOBS_PAGE_SIZE } from '@/constants/jobs';
import { jobService } from '@/services/jobService';
import type { JobPosting } from '@/types/jobs';
import { filterJobs, paginateJobs } from '@/utils/jobs';

export function JobsPage() {
  const [employmentType, setEmploymentType] = useState('All Types');
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [location, setLocation] = useState('All Locations');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('match');
  const [workMode, setWorkMode] = useState('All Modes');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const response = await jobService.getJobs({ page_size: 50, sort: 'match' });
        setJobs(response.jobs);
      } catch {
        toast.error('Unable to load recommended jobs.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadJobs();
  }, []);

  const filteredJobs = useMemo(
    () => filterJobs(jobs, { employmentType, location, search, sort, workMode }),
    [employmentType, jobs, location, search, sort, workMode],
  );
  const visibleJobs = paginateJobs(filteredJobs, page, JOBS_PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [employmentType, location, search, sort, workMode]);

  async function handleSave(job: JobPosting) {
    if (job.is_saved) {
      setJobs((current) =>
        current.map((item) => (item.id === job.id ? { ...item, is_saved: false } : item)),
      );
      toast.success('Removed from saved jobs.');
      return;
    }

    await jobService.saveJob(job.id);
    setJobs((current) =>
      current.map((item) => (item.id === job.id ? { ...item, is_saved: true } : item)),
    );
    toast.success('Job saved.');
  }

  async function handleApply(job: JobPosting) {
    await jobService.applyJob(job.id);
    setJobs((current) =>
      current.map((item) => (item.id === job.id ? { ...item, is_applied: true } : item)),
    );
    toast.success('Application placeholder submitted.');
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="mt-6 space-y-6">
      <header className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
        <p className="text-sm font-bold uppercase tracking-normal text-cyan-700 dark:text-cyan-300">
          Recommended Jobs
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">AI-ranked roles</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          Search, filter, sort, save, and apply to dummy recommended jobs prepared for the future
          matching engine.
        </p>
      </header>
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
      <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {visibleJobs.map((job, index) => (
          <JobCard index={index} job={job} key={job.id} onApply={handleApply} onToggleSave={handleSave} />
        ))}
      </section>
      <JobPagination onPageChange={setPage} page={page} pageSize={JOBS_PAGE_SIZE} total={filteredJobs.length} />
    </div>
  );
}
