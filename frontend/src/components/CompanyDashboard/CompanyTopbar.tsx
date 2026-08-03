import { useState } from 'react';
import { FiBell, FiChevronDown, FiLogOut, FiMenu, FiMessageSquare, FiMoon, FiSearch, FiSettings, FiSun, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import { useThemeMode } from '@/hooks/useThemeMode';

export function CompanyTopbar({ onLogout, onMenuToggle }: { onLogout: () => void; onMenuToggle: () => void }) {
  const { isDark, toggleTheme } = useThemeMode();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-slate-50/85 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8 dark:border-white/10 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <button aria-label="Open sidebar" className="grid size-10 place-items-center rounded-md border border-slate-200 bg-white lg:hidden dark:border-white/10 dark:bg-white/10" onClick={onMenuToggle} type="button"><FiMenu /></button>
        <label className="hidden h-11 min-w-0 flex-1 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 text-slate-500 shadow-sm md:flex dark:border-white/10 dark:bg-white/5">
          <FiSearch className="text-cyan-600" /><input className="w-full bg-transparent text-sm text-slate-950 outline-none dark:text-white" placeholder="Search jobs, applicants, interviews..." type="search" />
        </label>
        <div className="ml-auto flex items-center gap-2">
          <Link aria-label="Notifications" className="relative grid size-10 place-items-center rounded-md border border-slate-200 bg-white dark:border-white/10 dark:bg-white/10" to="/company/dashboard/notifications"><FiBell /><span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500" /></Link>
          <Link aria-label="Messages" className="relative grid size-10 place-items-center rounded-md border border-slate-200 bg-white dark:border-white/10 dark:bg-white/10" to="/company/dashboard/messages"><FiMessageSquare /></Link>
          <button aria-label="Toggle theme" className="grid size-10 place-items-center rounded-md border border-slate-200 bg-white dark:border-white/10 dark:bg-white/10" onClick={toggleTheme} type="button">{isDark ? <FiSun /> : <FiMoon />}</button>
          <div className="relative">
            <button aria-expanded={open} className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white pl-1.5 pr-3 dark:border-white/10 dark:bg-white/10" onClick={() => setOpen((value) => !value)} type="button">
              <span className="grid size-8 place-items-center rounded-md bg-gradient-to-br from-cyan-500 to-emerald-500 font-bold text-white">{user?.first_name?.[0] ?? 'N'}</span>
              <span className="hidden max-w-32 truncate text-sm font-bold sm:block">{user?.first_name ?? 'Northstar'}</span><FiChevronDown className="hidden sm:block" />
            </button>
            {open ? <div className="absolute right-0 mt-3 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-2xl dark:border-white/10 dark:bg-slate-900" role="menu">
              <Link className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-white/10" onClick={() => setOpen(false)} to="/company/dashboard/profile"><FiUsers />Company Profile</Link>
              <Link className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-white/10" onClick={() => setOpen(false)} to="/company/dashboard/settings"><FiSettings />Settings</Link>
              <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50" onClick={onLogout} type="button"><FiLogOut />Logout</button>
            </div> : null}
          </div>
        </div>
      </div>
      <label className="mt-3 flex h-11 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 md:hidden dark:border-white/10 dark:bg-white/5"><FiSearch /><input className="w-full bg-transparent text-sm outline-none" placeholder="Search company workspace..." type="search" /></label>
    </header>
  );
}

