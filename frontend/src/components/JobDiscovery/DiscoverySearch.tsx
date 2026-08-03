import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { FiClock, FiSearch, FiTrendingUp, FiX } from 'react-icons/fi';

import { TRENDING_SEARCHES } from '@/constants/jobs';
import type { JobPosting } from '@/types/jobs';

const HISTORY_KEY = 'aihire-job-search-history';

type Props = {
  jobs: JobPosting[];
  onSearch: (value: string) => void;
  value: string;
};

export function DiscoverySearch({ jobs, onSearch, value }: Props) {
  const [focused, setFocused] = useState(false);
  const [history, setHistory] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]') as string[]; } catch { return []; }
  });
  const suggestions = useMemo(() => {
    if (!value.trim()) return [];
    const needle = value.toLowerCase();
    return Array.from(new Set(jobs.flatMap((job) => [job.title, job.company, ...job.skills])))
      .filter((item) => item.toLowerCase().includes(needle)).slice(0, 5);
  }, [jobs, value]);

  useEffect(() => { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); }, [history]);

  function commit(term: string) {
    const clean = term.trim();
    onSearch(clean);
    if (clean) setHistory((current) => [clean, ...current.filter((item) => item !== clean)].slice(0, 5));
    setFocused(false);
  }

  const choices = value ? suggestions : history.length ? history : TRENDING_SEARCHES;
  const ChoiceIcon = value || history.length ? FiClock : FiTrendingUp;

  return (
    <div className="relative z-30">
      <form className="flex h-14 items-center rounded-lg border border-slate-200 bg-white px-4 shadow-lg shadow-slate-900/5 focus-within:border-cyan-400 dark:border-white/10 dark:bg-slate-900" onSubmit={(event) => { event.preventDefault(); commit(value); }}>
        <FiSearch className="size-5 shrink-0 text-cyan-600" />
        <input aria-label="Search jobs" className="min-w-0 flex-1 bg-transparent px-3 text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400 dark:text-white" onChange={(event) => onSearch(event.target.value)} onFocus={() => setFocused(true)} placeholder="Search jobs, skills, or companies" value={value} />
        {value && <button aria-label="Clear search" className="grid size-9 place-items-center text-slate-500 hover:text-slate-950 dark:hover:text-white" onClick={() => onSearch('')} type="button"><FiX /></button>}
        <button className="hidden h-10 rounded-md bg-cyan-600 px-5 text-sm font-bold text-white hover:bg-cyan-700 sm:block" type="submit">Search</button>
      </form>
      <AnimatePresence>
        {focused && choices.length > 0 && (
          <motion.div animate={{ opacity: 1, y: 0 }} className="absolute inset-x-0 top-[calc(100%+0.5rem)] overflow-hidden rounded-lg border border-slate-200 bg-white py-2 shadow-xl dark:border-white/10 dark:bg-slate-900" exit={{ opacity: 0, y: -4 }} initial={{ opacity: 0, y: -4 }}>
            <div className="flex items-center justify-between px-4 py-2 text-xs font-bold uppercase text-slate-500">
              <span>{value ? 'Suggestions' : history.length ? 'Recent searches' : 'Trending searches'}</span>
              {history.length > 0 && !value && <button className="text-cyan-700 dark:text-cyan-300" onMouseDown={(event) => event.preventDefault()} onClick={() => setHistory([])} type="button">Clear</button>}
            </div>
            {choices.map((choice) => <button className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-cyan-50 dark:text-slate-200 dark:hover:bg-white/5" key={choice} onMouseDown={(event) => event.preventDefault()} onClick={() => commit(choice)} type="button"><ChoiceIcon className="text-cyan-600" />{choice}</button>)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
