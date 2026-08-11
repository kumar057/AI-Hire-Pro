import { FiRotateCcw, FiSliders } from 'react-icons/fi';

import type { DiscoveryFilters } from '@/types/jobs';

type Props = { filters: DiscoveryFilters; onChange: (filters: DiscoveryFilters) => void };
const fields: Array<{ key: keyof DiscoveryFilters; label: string; options?: string[] }> = [
  { key: 'title', label: 'Job title' }, { key: 'skill', label: 'Skills' },
  { key: 'company', label: 'Company' }, { key: 'location', label: 'Location' },
  { key: 'country', label: 'Country' }, { key: 'state', label: 'State' }, { key: 'city', label: 'City' },
  { key: 'workMode', label: 'Work mode', options: ['Remote', 'Hybrid', 'On-site'] },
  { key: 'experience', label: 'Experience', options: ['Entry', 'Mid', 'Senior', 'Mid-Senior'] },
  { key: 'salary', label: 'Minimum salary', options: ['110000', '130000', '150000', '170000'] },
  { key: 'employmentType', label: 'Employment type', options: ['Full-time', 'Contract', 'Part-time'] },
  { key: 'department', label: 'Department' }, { key: 'industry', label: 'Industry' },
  { key: 'education', label: 'Education' }, { key: 'noticePeriod', label: 'Notice period' },
  { key: 'postedDate', label: 'Posted date', options: ['1', '7', '14', '30'] },
  { key: 'companySize', label: 'Company size', options: ['1-50', '51-200', '201-500', '501-1000'] },
  { key: 'status', label: 'Job status', options: ['Open', 'Closed'] },
];

export function DiscoveryFilters({ filters, onChange }: Props) {
  const active = Object.values(filters).filter(Boolean).length;
  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
      <div className="mb-4 flex items-center justify-between"><span className="flex items-center gap-2 font-bold text-slate-950 dark:text-white"><FiSliders className="text-cyan-600" />Filters {active > 0 && <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-xs text-cyan-800 dark:bg-cyan-300/10 dark:text-cyan-200">{active}</span>}</span><button aria-label="Reset filters" className="grid size-8 place-items-center text-slate-500 hover:text-cyan-700" onClick={() => onChange(Object.fromEntries(Object.keys(filters).map((key) => [key, ''])) as DiscoveryFilters)} title="Reset filters" type="button"><FiRotateCcw /></button></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {fields.map((field) => <label className="grid gap-1 text-xs font-bold text-slate-600 dark:text-slate-300" key={field.key}>{field.label}{field.options ? <select className="h-10 rounded-md border border-slate-200 bg-slate-50 px-2 text-sm font-medium text-slate-900 outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-white/5 dark:text-white" onChange={(event) => onChange({ ...filters, [field.key]: event.target.value })} value={filters[field.key]}><option value="">All</option>{field.options.map((option) => <option key={option} value={option}>{field.key === 'salary' ? `$${Number(option).toLocaleString()}+` : field.key === 'postedDate' ? `Last ${option} days` : option}</option>)}</select> : <input className="h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-900 outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-white/5 dark:text-white" onChange={(event) => onChange({ ...filters, [field.key]: event.target.value })} value={filters[field.key]} />}</label>)}
      </div>
    </aside>
  );
}
