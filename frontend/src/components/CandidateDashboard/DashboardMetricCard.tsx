import { motion } from 'framer-motion';

import { AnimatedCounter } from '@/components/CandidateDashboard/AnimatedCounter';
import type { CandidateMetric } from '@/types/candidateDashboard';

type DashboardMetricCardProps = {
  metric: CandidateMetric;
  index: number;
};

export function DashboardMetricCard({ index, metric }: DashboardMetricCardProps) {
  const Icon = metric.icon;

  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-950/10 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20 dark:hover:border-cyan-300/30"
      initial={{ opacity: 0, y: 18 }}
      transition={{ delay: index * 0.05, duration: 0.45, ease: 'easeOut' }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start justify-between gap-4">
        <span className={`grid size-11 place-items-center rounded-lg ${metric.tone}`}>
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
          {metric.trend}
        </span>
      </div>
      <p className="mt-5 text-sm font-semibold text-slate-500 dark:text-slate-400">
        {metric.label}
      </p>
      <div className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
        <AnimatedCounter suffix={metric.suffix} value={metric.value} />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{metric.helper}</p>
    </motion.article>
  );
}
