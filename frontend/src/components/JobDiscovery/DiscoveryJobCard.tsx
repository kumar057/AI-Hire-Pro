import { motion } from 'framer-motion';
import { FiBookmark, FiBriefcase, FiClock, FiMapPin, FiShare2, FiZap } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { Highlight } from '@/components/JobDiscovery/Highlight';
import type { JobPosting } from '@/types/jobs';

type Props = { job: JobPosting; index: number; query: string; view: 'grid' | 'list'; onApply: (job: JobPosting) => void; onSave: (job: JobPosting) => void; onShare: (job: JobPosting) => void };

export function DiscoveryJobCard({ job, index, onApply, onSave, onShare, query, view }: Props) {
  return (
    <motion.article animate={{ opacity: 1, y: 0 }} className={view === 'list' ? 'w-full' : ''} initial={{ opacity: 0, y: 14 }} transition={{ delay: index * 0.035 }}>
      <div className={`group h-full rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-cyan-300 hover:shadow-lg dark:border-white/10 dark:bg-slate-900/70 ${view === 'list' ? 'md:flex md:items-center md:gap-6' : ''}`}>
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-cyan-50 text-lg font-black text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-200" aria-label={`${job.company} logo`}>{job.company.slice(0, 2).toUpperCase()}</div>
          <div className="min-w-0"><div className="flex flex-wrap items-center gap-2">{job.is_featured && <span className="rounded bg-amber-100 px-2 py-1 text-[11px] font-bold text-amber-800">Featured</span>}<span className="rounded bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-200">{job.work_mode}</span></div><Link className="mt-2 block text-lg font-bold text-slate-950 hover:text-cyan-700 dark:text-white dark:hover:text-cyan-300" to={`/candidate/dashboard/jobs/${job.id}`}><Highlight query={query} text={job.title} /></Link><p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300"><Highlight query={query} text={job.company} /></p></div>
        </div>
        <div className={`mt-4 min-w-0 flex-1 ${view === 'list' ? 'md:mt-0' : ''}`}>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400"><span className="flex items-center gap-1"><FiMapPin />{job.location}</span><span className="flex items-center gap-1"><FiBriefcase />{job.experience_level}</span><span className="flex items-center gap-1"><FiClock />{job.posted_at}</span></div>
          <p className="mt-3 font-bold text-slate-900 dark:text-white">{job.salary_range}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">{job.skills.slice(0, 4).map((skill) => <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300" key={skill}><Highlight query={query} text={skill} /></span>)}</div>
          <p className="mt-3 text-xs font-bold text-slate-500">{job.employment_type} · {job.applicants} applicants</p>
        </div>
        <div className={`mt-5 flex shrink-0 items-center gap-2 ${view === 'list' ? 'md:mt-0 md:flex-col' : ''}`}>
          <button aria-label={job.is_saved ? 'Remove saved job' : 'Save job'} className={`grid size-10 place-items-center rounded-md border ${job.is_saved ? 'border-cyan-300 bg-cyan-50 text-cyan-700 dark:bg-cyan-300/10' : 'border-slate-200 text-slate-500 dark:border-white/10'}`} onClick={() => onSave(job)} title="Save job" type="button"><FiBookmark className={job.is_saved ? 'fill-current' : ''} /></button>
          <button aria-label="Share job" className="grid size-10 place-items-center rounded-md border border-slate-200 text-slate-500 dark:border-white/10" onClick={() => onShare(job)} title="Share job" type="button"><FiShare2 /></button>
          <button className="flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-cyan-600 px-4 text-sm font-bold text-white hover:bg-cyan-700 disabled:opacity-60 md:flex-none" disabled={job.is_applied} onClick={() => onApply(job)} type="button"><FiZap />{job.is_applied ? 'Applied' : 'Quick Apply'}</button>
        </div>
      </div>
    </motion.article>
  );
}
