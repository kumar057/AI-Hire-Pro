import gsap from 'gsap';
import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FiGrid, FiList, FiSliders, FiX } from 'react-icons/fi';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { DiscoveryFilters } from '@/components/JobDiscovery/DiscoveryFilters';
import { DiscoveryJobCard } from '@/components/JobDiscovery/DiscoveryJobCard';
import { DiscoverySearch } from '@/components/JobDiscovery/DiscoverySearch';
import { DiscoverySkeleton } from '@/components/JobDiscovery/DiscoverySkeleton';
import { JobPagination } from '@/components/CandidateJobs/JobPagination';
import { DISCOVERY_SORT_OPTIONS, EMPTY_DISCOVERY_FILTERS, JOBS_PAGE_SIZE } from '@/constants/jobs';
import { jobService } from '@/services/jobService';
import { applicationService } from '@/services/applicationService';
import type { DiscoveryFilters as FilterState, JobPosting } from '@/types/jobs';
import { filterDiscoveryJobs, paginateJobs, sortDiscoveryJobs } from '@/utils/jobs';

type Props = { mode?: 'browse' | 'featured' | 'search' | 'similar' };

export function JobDiscoveryPage({ mode = 'browse' }: Props) {
  const [params, setParams] = useSearchParams();
  const { jobId = '' } = useParams();
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filters, setFilters] = useState<FilterState>({ ...EMPTY_DISCOVERY_FILTERS });
  const [sort, setSort] = useState('relevance');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilters, setMobileFilters] = useState(false);
  const query = params.get('q') ?? '';

  useEffect(() => {
    gsap.fromTo(headerRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45 });
  }, [mode]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const response = mode === 'featured' ? await jobService.getFeaturedJobs() : mode === 'similar' ? await jobService.getSimilarJobs(jobId) : mode === 'search' && query ? await jobService.searchJobs(query) : await jobService.getJobs({ page_size: 50 });
        setJobs(response.jobs);
      } catch { toast.error('Unable to load jobs.'); }
      finally { setLoading(false); }
    }
    void load();
  }, [jobId, mode, query]);

  const results = useMemo(() => sortDiscoveryJobs(filterDiscoveryJobs(jobs, filters, query), sort), [filters, jobs, query, sort]);
  const visible = paginateJobs(results, page, JOBS_PAGE_SIZE);
  useEffect(() => { setPage(1); }, [filters, query, sort]);

  function updateQuery(value: string) {
    if (mode === 'browse' && value) { navigate(`/candidate/dashboard/jobs/search?q=${encodeURIComponent(value)}`); return; }
    setParams(value ? { q: value } : {});
  }
  async function save(job: JobPosting) {
    if (!job.is_saved) await jobService.saveJob(job.id);
    setJobs((items) => items.map((item) => item.id === job.id ? { ...item, is_saved: !item.is_saved } : item));
    toast.success(job.is_saved ? 'Removed from saved jobs.' : 'Job saved.');
  }
  async function apply(job: JobPosting) {
    await applicationService.create({ job_id: job.id, resume_id: 'resume-current', cover_letter: '', status: 'Submitted', quick_apply: true });
    setJobs((items) => items.map((item) => item.id === job.id ? { ...item, is_applied: true } : item));
    toast.success('Quick application placeholder submitted.');
  }
  async function share(job: JobPosting) {
    const url = `${window.location.origin}/candidate/dashboard/jobs/${job.id}`;
    await navigator.clipboard?.writeText(url);
    toast.success('Job link copied.');
  }
  const title = mode === 'featured' ? 'Featured jobs' : mode === 'similar' ? 'Similar jobs' : mode === 'search' ? 'Search results' : 'Browse jobs';

  return <div className="mt-6 space-y-5">
    <header className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 px-5 py-7 text-white shadow-sm dark:border-white/10" ref={headerRef}><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-bold uppercase text-cyan-300">Job Discovery</p><nav aria-label="Job discovery views" className="flex gap-1 rounded-md bg-white/10 p-1"><Link className={`rounded px-3 py-1.5 text-xs font-bold ${mode === 'browse' || mode === 'search' ? 'bg-white text-slate-950' : 'text-slate-200 hover:bg-white/10'}`} to="/candidate/dashboard/jobs">Browse</Link><Link className={`rounded px-3 py-1.5 text-xs font-bold ${mode === 'featured' ? 'bg-white text-slate-950' : 'text-slate-200 hover:bg-white/10'}`} to="/candidate/dashboard/jobs/featured">Featured</Link></nav></div><h1 className="mt-2 text-3xl font-bold">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Explore relevant opportunities with immediate filtering, transparent role details, and efficient candidate actions.</p><div className="mt-6 max-w-4xl"><DiscoverySearch jobs={jobs} onSearch={updateQuery} value={query} /></div></header>
    <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-semibold text-slate-600 dark:text-slate-300"><strong className="text-slate-950 dark:text-white">{results.length}</strong> opportunities found</p><div className="flex items-center gap-2"><button className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold lg:hidden dark:border-white/10 dark:bg-slate-900" onClick={() => setMobileFilters(true)} type="button"><FiSliders />Filters</button><select aria-label="Sort jobs" className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold dark:border-white/10 dark:bg-slate-900" onChange={(event) => setSort(event.target.value)} value={sort}>{DISCOVERY_SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><div className="flex rounded-md border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-slate-900"><button aria-label="Grid view" className={`grid size-8 place-items-center rounded ${view === 'grid' ? 'bg-cyan-600 text-white' : 'text-slate-500'}`} onClick={() => setView('grid')} type="button"><FiGrid /></button><button aria-label="List view" className={`grid size-8 place-items-center rounded ${view === 'list' ? 'bg-cyan-600 text-white' : 'text-slate-500'}`} onClick={() => setView('list')} type="button"><FiList /></button></div></div></div>
    <div className="grid items-start gap-5 lg:grid-cols-[250px_minmax(0,1fr)]"><div className="hidden lg:block"><DiscoveryFilters filters={filters} onChange={setFilters} /></div><main>{loading ? <DiscoverySkeleton /> : visible.length ? <div className={view === 'grid' ? 'grid gap-4 xl:grid-cols-2' : 'grid gap-4'}>{visible.map((job, index) => <DiscoveryJobCard index={index} job={job} key={job.id} onApply={apply} onSave={save} onShare={share} query={query} view={view} />)}</div> : <div className="rounded-lg border border-dashed border-slate-300 py-16 text-center dark:border-white/15"><h2 className="font-bold text-slate-950 dark:text-white">No matching jobs</h2><p className="mt-2 text-sm text-slate-500">Clear a filter or broaden your search.</p></div>}<div data-infinite-scroll-sentinel="true" /><JobPagination onPageChange={setPage} page={page} pageSize={JOBS_PAGE_SIZE} total={results.length} /></main></div>
    {mobileFilters && <div className="fixed inset-0 z-50 bg-slate-950/50 lg:hidden" onClick={() => setMobileFilters(false)}><div className="ml-auto h-full w-[min(90vw,360px)] overflow-y-auto bg-slate-50 p-4 dark:bg-slate-950" onClick={(event) => event.stopPropagation()}><div className="mb-3 flex items-center justify-between"><strong>Filter jobs</strong><button aria-label="Close filters" className="grid size-9 place-items-center" onClick={() => setMobileFilters(false)} type="button"><FiX /></button></div><DiscoveryFilters filters={filters} onChange={setFilters} /></div></div>}
  </div>;
}
