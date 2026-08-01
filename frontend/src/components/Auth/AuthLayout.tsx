import gsap from 'gsap';
import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiMoon, FiSun } from 'react-icons/fi';

import { APP_NAME } from '@/constants/app';

type AuthLayoutProps = PropsWithChildren<{
  eyebrow: string;
  subtitle: string;
  title: string;
}>;

export function AuthLayout({ children, eyebrow, subtitle, title }: AuthLayoutProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = storedTheme ? storedTheme === 'dark' : prefersDark;

    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);

    const context = gsap.context(() => {
      gsap.to('.auth-orb', {
        duration: 8,
        ease: 'sine.inOut',
        repeat: -1,
        rotate: 14,
        scale: 1.08,
        yoyo: true,
      });
    });

    return () => context.revert();
  }, []);

  function toggleTheme() {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme);
    window.localStorage.setItem('theme', nextTheme ? 'dark' : 'light');
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-white">
      <div className="auth-orb absolute -left-32 top-12 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-400/15" />
      <div className="auth-orb absolute -right-28 bottom-12 h-96 w-96 rounded-full bg-amber-300/30 blur-3xl dark:bg-emerald-400/15" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.06)_1px,transparent_1px)] bg-[size:44px_44px] opacity-55 dark:bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between">
          <Link className="inline-flex items-center gap-3" to="/">
            <span className="grid size-10 place-items-center rounded-lg bg-slate-950 text-white shadow-lg shadow-cyan-950/10 dark:bg-white dark:text-slate-950">
              <FiBriefcase aria-hidden="true" />
            </span>
            <span className="text-lg font-bold">{APP_NAME}</span>
          </Link>
          <button
            aria-label="Toggle dark mode"
            className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white"
            onClick={toggleTheme}
            type="button"
          >
            {isDark ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
          </button>
        </header>

        <section className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="hidden lg:block">
            <p className="text-sm font-bold uppercase tracking-normal text-cyan-700 dark:text-cyan-300">
              {eyebrow}
            </p>
            <h1 className="mt-4 max-w-xl text-5xl font-bold tracking-normal">{title}</h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300">
              {subtitle}
            </p>
          </div>

          <div className="mx-auto w-full max-w-xl rounded-lg border border-white/60 bg-white/80 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur-xl sm:p-8 dark:border-white/10 dark:bg-slate-900/75 dark:shadow-black/30">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}

