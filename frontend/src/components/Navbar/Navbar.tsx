import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  FiBriefcase,
  FiGrid,
  FiLogIn,
  FiMenu,
  FiMoon,
  FiSun,
  FiUserPlus,
  FiX,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { APP_NAME } from '@/constants/app';
import { navItems } from '@/constants/landing';
import { useAuth } from '@/hooks/useAuth';
import { roleDashboardPath } from '@/utils/auth';

export function Navbar() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const dashboardPath = user ? roleDashboardPath(user.role) : '/candidate/dashboard';

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = storedTheme ? storedTheme === 'dark' : prefersDark;

    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  function toggleTheme() {
    const nextTheme = !isDark;

    setIsDark(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme);
    window.localStorage.setItem('theme', nextTheme ? 'dark' : 'light');
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/45 bg-white/75 shadow-sm shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a className="flex items-center gap-3" href="#home" onClick={() => setIsMenuOpen(false)}>
          <span className="grid size-10 place-items-center rounded-lg bg-slate-950 text-white shadow-lg shadow-cyan-900/20 dark:bg-white dark:text-slate-950">
            <FiBriefcase aria-hidden="true" className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-normal text-slate-950 dark:text-white">
            {APP_NAME}
          </span>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
              href={item.href}
              key={item.label}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            aria-label="Toggle dark mode"
            className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:hover:text-cyan-200"
            onClick={toggleTheme}
            type="button"
          >
            {isDark ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
          </button>
          {user ? (
            <Link
              className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white shadow-lg shadow-cyan-950/10 transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              to={dashboardPath}
            >
              <FiGrid aria-hidden="true" />
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-100 dark:hover:bg-white/10"
                to="/candidate/login"
              >
                <FiLogIn aria-hidden="true" />
                Login
              </Link>
              <Link
                className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white shadow-lg shadow-cyan-950/10 transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                to="/candidate/register"
              >
                <FiUserPlus aria-hidden="true" />
                Register
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            aria-label="Toggle dark mode"
            className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
            onClick={toggleTheme}
            type="button"
          >
            {isDark ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
          </button>
          <button
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
            className="grid size-10 place-items-center rounded-md border border-slate-200 bg-white text-slate-800 dark:border-white/10 dark:bg-white/10 dark:text-white"
            onClick={() => setIsMenuOpen((current) => !current)}
            type="button"
          >
            {isMenuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-slate-200 bg-white/95 px-4 py-4 shadow-xl shadow-slate-900/10 backdrop-blur-xl lg:hidden dark:border-white/10 dark:bg-slate-950/95"
            exit={{ opacity: 0, y: -12 }}
            initial={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {navItems.map((item) => (
                <a
                  className="rounded-md px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10"
                  href={item.href}
                  key={item.label}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-3">
                {user ? (
                  <Link
                    className="col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
                    onClick={() => setIsMenuOpen(false)}
                    to={dashboardPath}
                  >
                    <FiGrid aria-hidden="true" />
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-200 text-sm font-semibold text-slate-700 dark:border-white/10 dark:text-slate-100"
                      onClick={() => setIsMenuOpen(false)}
                      to="/candidate/login"
                    >
                      <FiLogIn aria-hidden="true" />
                      Login
                    </Link>
                    <Link
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
                      onClick={() => setIsMenuOpen(false)}
                      to="/candidate/register"
                    >
                      <FiUserPlus aria-hidden="true" />
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
