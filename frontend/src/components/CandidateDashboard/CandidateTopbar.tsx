import { useState } from 'react';
import {
  FiBell,
  FiChevronDown,
  FiLogOut,
  FiMenu,
  FiMessageSquare,
  FiMoon,
  FiSearch,
  FiSettings,
  FiSun,
  FiUser,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import { useThemeMode } from '@/hooks/useThemeMode';

type CandidateTopbarProps = {
  onLogout: () => void;
  onMenuToggle: () => void;
};

export function CandidateTopbar({ onLogout, onMenuToggle }: CandidateTopbarProps) {
  const { isDark, toggleTheme } = useThemeMode();
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const initials = `${user?.first_name?.[0] ?? 'A'}${user?.last_name?.[0] ?? 'P'}`.toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-slate-50/85 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8 dark:border-white/10 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <button
          aria-label="Open sidebar"
          className="grid size-10 shrink-0 place-items-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden dark:border-white/10 dark:bg-white/10 dark:text-white"
          onClick={onMenuToggle}
          type="button"
        >
          <FiMenu aria-hidden="true" />
        </button>

        <label className="hidden h-11 min-w-0 flex-1 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 text-slate-500 shadow-sm focus-within:border-cyan-300 md:flex dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          <FiSearch aria-hidden="true" className="size-5 shrink-0 text-cyan-600 dark:text-cyan-300" />
          <input
            className="w-full bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
            placeholder="Search jobs, companies, messages..."
            type="search"
          />
        </label>

        <div className="ml-auto flex items-center gap-2">
          <button
            aria-label="Notifications"
            className="relative grid size-10 place-items-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-cyan-200 hover:text-cyan-700 dark:border-white/10 dark:bg-white/10 dark:text-white"
            type="button"
          >
            <FiBell aria-hidden="true" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500" />
          </button>
          <button
            aria-label="Messages"
            className="relative grid size-10 place-items-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-cyan-200 hover:text-cyan-700 dark:border-white/10 dark:bg-white/10 dark:text-white"
            type="button"
          >
            <FiMessageSquare aria-hidden="true" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-emerald-500" />
          </button>
          <button
            aria-label="Toggle dark mode"
            className="grid size-10 place-items-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-cyan-200 hover:text-cyan-700 dark:border-white/10 dark:bg-white/10 dark:text-white"
            onClick={toggleTheme}
            type="button"
          >
            {isDark ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
          </button>

          <div className="relative">
            <button
              aria-expanded={isDropdownOpen}
              aria-haspopup="menu"
              className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white pl-1.5 pr-3 text-left shadow-sm transition hover:border-cyan-200 dark:border-white/10 dark:bg-white/10"
              onClick={() => setIsDropdownOpen((current) => !current)}
              type="button"
            >
              <span className="grid size-8 place-items-center rounded-md bg-gradient-to-br from-cyan-500 to-emerald-500 text-sm font-bold text-white">
                {initials}
              </span>
              <span className="hidden max-w-32 truncate text-sm font-bold text-slate-800 sm:block dark:text-white">
                {user?.first_name ?? 'Candidate'}
              </span>
              <FiChevronDown aria-hidden="true" className="hidden text-slate-500 sm:block" />
            </button>

            {isDropdownOpen ? (
              <div
                className="absolute right-0 mt-3 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/15 dark:border-white/10 dark:bg-slate-900"
                role="menu"
              >
                <Link
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
                  onClick={() => setIsDropdownOpen(false)}
                  role="menuitem"
                  to="/candidate/dashboard/profile"
                >
                  <FiUser aria-hidden="true" />
                  My Profile
                </Link>
                <Link
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
                  onClick={() => setIsDropdownOpen(false)}
                  role="menuitem"
                  to="/candidate/dashboard/settings"
                >
                  <FiSettings aria-hidden="true" />
                  Settings
                </Link>
                <button
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-200 dark:hover:bg-rose-300/10"
                  onClick={onLogout}
                  role="menuitem"
                  type="button"
                >
                  <FiLogOut aria-hidden="true" />
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <label className="mt-3 flex h-11 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 text-slate-500 shadow-sm focus-within:border-cyan-300 md:hidden dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
        <FiSearch aria-hidden="true" className="size-5 shrink-0 text-cyan-600 dark:text-cyan-300" />
        <input
          className="w-full bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
          placeholder="Search..."
          type="search"
        />
      </label>
    </header>
  );
}
