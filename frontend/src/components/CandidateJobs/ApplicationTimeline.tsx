import { motion } from 'framer-motion';

import { Badge } from '@/components/ui/badge';
import type { CandidateApplication } from '@/types/jobs';

type ApplicationTimelineProps = {
  application: CandidateApplication;
};

export function ApplicationTimeline({ application }: ApplicationTimelineProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">
            {application.job.title}
          </h2>
          <p className="mt-1 text-sm font-semibold text-cyan-700 dark:text-cyan-300">
            {application.job.company}
          </p>
        </div>
        <Badge>{application.status}</Badge>
      </div>

      <div className="mt-6 space-y-5">
        {application.timeline.map((item, index) => (
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="relative pl-8"
            initial={{ opacity: 0, x: -12 }}
            key={item.id}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <span
              className={`absolute left-0 top-1.5 size-3 rounded-full ${
                item.status === 'complete'
                  ? 'bg-emerald-500'
                  : item.status === 'active'
                    ? 'bg-cyan-500'
                    : 'bg-slate-300 dark:bg-white/20'
              }`}
            />
            {index < application.timeline.length - 1 ? (
              <span className="absolute left-[5px] top-5 h-[calc(100%+0.75rem)] w-px bg-slate-200 dark:bg-white/10" />
            ) : null}
            <div>
              <p className="font-bold text-slate-950 dark:text-white">{item.label}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
