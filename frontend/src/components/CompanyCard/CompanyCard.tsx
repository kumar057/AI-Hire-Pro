import { FiArrowUpRight } from 'react-icons/fi';

import type { Company } from '@/constants/landing';
import { useTiltCard } from '@/hooks/useTiltCard';

type CompanyCardProps = {
  company: Company;
};

export function CompanyCard({ company }: CompanyCardProps) {
  const tilt = useTiltCard();
  const Icon = company.icon;

  return (
    <article
      className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition duration-300 will-change-transform hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-950/10 dark:border-white/10 dark:bg-white/5 dark:hover:border-cyan-300/40"
      data-tilt-card
      ref={tilt.ref}
      onMouseLeave={tilt.onMouseLeave}
      onMouseMove={tilt.onMouseMove}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${company.accentClass}`}
        aria-hidden="true"
      />
      <div className="flex items-start justify-between gap-4">
        <div className={`grid size-12 place-items-center rounded-lg bg-gradient-to-br ${company.accentClass} text-white shadow-lg shadow-slate-900/10`}>
          <Icon aria-hidden="true" className="size-6" />
        </div>
        <button
          aria-label={`View ${company.name}`}
          className="grid size-9 place-items-center rounded-full border border-slate-200 text-slate-500 transition group-hover:border-cyan-300 group-hover:text-cyan-700 dark:border-white/10 dark:text-slate-300 dark:group-hover:text-cyan-200"
          type="button"
        >
          <FiArrowUpRight aria-hidden="true" />
        </button>
      </div>
      <h3 className="mt-5 text-xl font-bold tracking-normal text-slate-950 dark:text-white">
        {company.name}
      </h3>
      <p className="mt-1 text-sm font-semibold text-cyan-700 dark:text-cyan-300">{company.sector}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{company.description}</p>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/10">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Open roles</span>
        <span className="text-lg font-bold text-slate-950 dark:text-white">{company.openRoles}</span>
      </div>
    </article>
  );
}

