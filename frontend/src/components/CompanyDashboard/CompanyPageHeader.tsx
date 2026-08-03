import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function CompanyPageHeader({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <motion.header animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70" initial={{ opacity: 0, y: 14 }}>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold uppercase text-cyan-700 dark:text-cyan-300">Company Workspace</p><h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{title}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p></div>{action}</div>
  </motion.header>;
}

