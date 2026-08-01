import { motion } from 'framer-motion';
import { FiClock } from 'react-icons/fi';

import type { CandidateResumeHistoryItem } from '@/types/candidateResume';
import { formatDate, formatFileSize } from '@/utils/resumeFormat';

type ResumeHistoryTimelineProps = {
  items: CandidateResumeHistoryItem[];
};

export function ResumeHistoryTimeline({ items }: ResumeHistoryTimelineProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-300/10 dark:text-amber-200">
          <FiClock aria-hidden="true" className="size-5" />
        </span>
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-cyan-700 dark:text-cyan-300">
            Resume History
          </p>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Recent files</h2>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {items.map((item, index) => (
          <motion.article
            animate={{ opacity: 1, x: 0 }}
            className="rounded-lg bg-slate-50 p-4 dark:bg-white/5"
            initial={{ opacity: 0, x: 12 }}
            key={item.id}
            transition={{ delay: index * 0.05, duration: 0.32, ease: 'easeOut' }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-950 dark:text-white">
                  {item.file_name}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {formatDate(item.upload_date)} • {formatFileSize(item.file_size)}
                </p>
              </div>
              <span className="shrink-0 rounded-md bg-white px-2.5 py-1 text-xs font-bold text-slate-600 shadow-sm dark:bg-slate-950 dark:text-slate-300">
                {item.action}
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
