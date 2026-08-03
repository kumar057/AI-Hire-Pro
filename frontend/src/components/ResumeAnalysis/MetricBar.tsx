import { motion } from 'framer-motion';

import type { ScoreMetric } from '@/types/resumeAnalysis';

export function MetricBar({ metric }: { metric: ScoreMetric }) {
  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-3">
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{metric.label}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{metric.summary}</p>
        </div>
        <span className="text-sm font-bold text-cyan-700 dark:text-cyan-300">{metric.score}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
        <motion.div
          animate={{ width: `${metric.score}%` }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
          initial={{ width: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

