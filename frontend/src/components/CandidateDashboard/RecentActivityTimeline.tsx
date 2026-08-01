import { motion } from 'framer-motion';

import type { CandidateActivity } from '@/types/candidateDashboard';

type RecentActivityTimelineProps = {
  items: CandidateActivity[];
};

export function RecentActivityTimeline({ items }: RecentActivityTimelineProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-cyan-700 dark:text-cyan-300">
            Recent Activity
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">Timeline</h2>
        </div>
        <span className="rounded-md bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
          Dummy data
        </span>
      </div>

      <div className="mt-6 space-y-5">
        {items.map((item, index) => (
          <motion.article
            animate={{ opacity: 1, x: 0 }}
            className="relative pl-8"
            initial={{ opacity: 0, x: -14 }}
            key={item.id}
            transition={{ delay: index * 0.06, duration: 0.35, ease: 'easeOut' }}
          >
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1.5 size-3 rounded-full ${item.tone}`}
            />
            {index < items.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute left-[5px] top-5 h-[calc(100%+0.75rem)] w-px bg-slate-200 dark:bg-white/10"
              />
            ) : null}
            <div className="rounded-lg bg-slate-50 p-4 dark:bg-white/5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-bold text-slate-950 dark:text-white">{item.title}</h3>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {item.time}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {item.description}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
