import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import type { CandidateQuickAction } from '@/types/candidateDashboard';

type QuickActionsProps = {
  actions: CandidateQuickAction[];
};

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20">
      <div>
        <p className="text-sm font-bold uppercase tracking-normal text-cyan-700 dark:text-cyan-300">
          Quick Actions
        </p>
        <h2 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">Next best steps</h2>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 12 }}
              key={action.id}
              transition={{ delay: index * 0.05, duration: 0.35, ease: 'easeOut' }}
            >
              <Link
                className="group flex min-h-24 items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-white hover:shadow-lg hover:shadow-cyan-950/10 dark:border-white/10 dark:bg-white/5 dark:hover:border-cyan-300/30 dark:hover:bg-white/10"
                to={action.to}
              >
                <span
                  className={`grid size-12 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${action.tone} text-white shadow-lg shadow-slate-900/10`}
                >
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-bold text-slate-950 dark:text-white">
                    {action.label}
                  </span>
                  <span className="mt-1 block text-sm leading-5 text-slate-600 dark:text-slate-300">
                    {action.description}
                  </span>
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
