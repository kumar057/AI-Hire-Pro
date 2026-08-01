import { FiArrowRight, FiMapPin, FiShield } from 'react-icons/fi';

import type { Job } from '@/constants/landing';
import { useTiltCard } from '@/hooks/useTiltCard';

type JobCardProps = {
  job: Job;
};

export function JobCard({ job }: JobCardProps) {
  const tilt = useTiltCard(6);

  return (
    <article
      className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition duration-300 will-change-transform hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-950/10 dark:border-white/10 dark:bg-white/5 dark:hover:border-emerald-300/40"
      data-tilt-card
      ref={tilt.ref}
      onMouseLeave={tilt.onMouseLeave}
      onMouseMove={tilt.onMouseMove}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">{job.company}</p>
          <h3 className="mt-2 text-xl font-bold tracking-normal text-slate-950 dark:text-white">
            {job.title}
          </h3>
        </div>
        <span className="rounded-md bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800 dark:bg-emerald-300/15 dark:text-emerald-200">
          {job.match}%
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
        <span className="inline-flex items-center gap-2">
          <FiMapPin aria-hidden="true" />
          {job.location}
        </span>
        <span className="inline-flex items-center gap-2">
          <FiShield aria-hidden="true" />
          {job.type}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {job.skills.map((skill) => (
          <span
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
            key={skill}
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/10">
        <span className="text-base font-bold text-slate-950 dark:text-white">{job.salary}</span>
        <button
          className="inline-flex size-10 items-center justify-center rounded-full bg-slate-950 text-white transition group-hover:bg-cyan-700 dark:bg-white dark:text-slate-950 dark:group-hover:bg-cyan-100"
          type="button"
          aria-label={`View ${job.title}`}
        >
          <FiArrowRight aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

