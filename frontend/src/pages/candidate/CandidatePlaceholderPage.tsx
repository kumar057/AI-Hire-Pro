import { motion } from 'framer-motion';
import type { IconType } from 'react-icons';
import { FiArrowRight, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

type CandidatePlaceholderPageProps = {
  description: string;
  icon: IconType;
  title: string;
};

export function CandidatePlaceholderPage({
  description,
  icon: Icon,
  title,
}: CandidatePlaceholderPageProps) {
  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5 sm:p-8 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20"
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <span className="grid size-14 place-items-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-200">
            <Icon aria-hidden="true" className="size-7" />
          </span>
          <p className="mt-6 text-sm font-bold uppercase tracking-normal text-cyan-700 dark:text-cyan-300">
            Candidate Workspace
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl dark:text-white">
            {title}
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
            {description}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
            <span className="grid size-10 place-items-center rounded-lg bg-white text-cyan-700 shadow-sm dark:bg-white/10 dark:text-cyan-200">
              <FiClock aria-hidden="true" />
            </span>
            Foundation placeholder
          </div>
          <p className="mt-3 max-w-xs text-sm leading-6 text-slate-600 dark:text-slate-300">
            Business workflows and data integrations will be added in later feature slices.
          </p>
          <Link
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan-700 transition hover:text-cyan-900 dark:text-cyan-300 dark:hover:text-cyan-100"
            to="/candidate/dashboard"
          >
            Back to overview
            <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
