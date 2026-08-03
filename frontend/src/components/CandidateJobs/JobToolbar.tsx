import { FiFilter, FiSearch } from 'react-icons/fi';

import { JOB_FILTERS } from '@/constants/jobs';

type JobToolbarProps = {
  employmentType: string;
  location: string;
  onEmploymentTypeChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onWorkModeChange: (value: string) => void;
  search: string;
  sort: string;
  workMode: string;
};

export function JobToolbar({
  employmentType,
  location,
  onEmploymentTypeChange,
  onLocationChange,
  onSearchChange,
  onSortChange,
  onWorkModeChange,
  search,
  sort,
  workMode,
}: JobToolbarProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_repeat(4,12rem)]">
        <label className="flex h-11 min-w-0 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 focus-within:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          <FiSearch aria-hidden="true" className="size-4 shrink-0 text-cyan-600 dark:text-cyan-300" />
          <input
            className="w-full bg-transparent font-medium text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search jobs, skills, companies..."
            type="search"
            value={search}
          />
        </label>
        <SelectField label="Location" onChange={onLocationChange} value={location} values={JOB_FILTERS.locations} />
        <SelectField label="Work Mode" onChange={onWorkModeChange} value={workMode} values={JOB_FILTERS.workModes} />
        <SelectField
          label="Job Type"
          onChange={onEmploymentTypeChange}
          value={employmentType}
          values={JOB_FILTERS.employmentTypes}
        />
        <label className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 dark:border-white/10 dark:bg-white/5">
          <FiFilter aria-hidden="true" className="size-4 text-cyan-600 dark:text-cyan-300" />
          <select
            className="w-full bg-transparent text-sm font-bold text-slate-700 outline-none dark:text-slate-200"
            onChange={(event) => onSortChange(event.target.value)}
            value={sort}
          >
            {JOB_FILTERS.sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

function SelectField({
  label,
  onChange,
  value,
  values,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
  values: string[];
}) {
  return (
    <label className="sr-only">
      {label}
      <select
        className="not-sr-only flex h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {values.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );
}
