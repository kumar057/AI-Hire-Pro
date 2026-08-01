import { motion } from 'framer-motion';
import { FiBriefcase, FiLogOut, FiShield, FiUserCheck } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types/api';
import { readableRole } from '@/utils/auth';

type DashboardPageProps = {
  role: UserRole;
};

const roleCopy: Record<UserRole, string> = {
  admin: 'Platform administration controls will live here.',
  candidate: 'Candidate career tools and applications will live here.',
  company: 'Company hiring workflows and jobs will live here.',
};

export function DashboardPage({ role }: DashboardPageProps) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const roleLabel = readableRole(role);

  async function handleLogout() {
    await logout();
    navigate(`/${role === 'admin' ? 'candidate' : role}/login`, { replace: true });
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
          <Link className="inline-flex items-center gap-3" to="/">
            <span className="grid size-10 place-items-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <FiBriefcase aria-hidden="true" />
            </span>
            <span className="text-lg font-bold">AIHire Pro</span>
          </Link>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-rose-300 hover:text-rose-700 dark:border-white/10 dark:bg-white/10 dark:text-white"
            onClick={handleLogout}
            type="button"
          >
            <FiLogOut aria-hidden="true" />
            Logout
          </button>
        </header>

        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="py-12"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <p className="text-sm font-bold uppercase tracking-normal text-cyan-700 dark:text-cyan-300">
            {roleLabel} dashboard
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-normal sm:text-5xl">
            Welcome{user ? `, ${user.first_name}` : ''}.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            {roleCopy[role]} This placeholder verifies authentication, authorization, and
            role-based redirects without building dashboard business features yet.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
              <FiShield aria-hidden="true" className="size-7 text-cyan-600 dark:text-cyan-300" />
              <h2 className="mt-4 text-lg font-bold">Protected route</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                This page requires a valid authenticated session.
              </p>
            </article>
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
              <FiUserCheck aria-hidden="true" className="size-7 text-emerald-600 dark:text-emerald-300" />
              <h2 className="mt-4 text-lg font-bold">Role access</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Only {roleLabel.toLowerCase()} users can access this placeholder.
              </p>
            </article>
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
              <FiBriefcase aria-hidden="true" className="size-7 text-amber-600 dark:text-amber-300" />
              <h2 className="mt-4 text-lg font-bold">Next feature slice</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Product workflows can be added cleanly on top of this guard layer.
              </p>
            </article>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

