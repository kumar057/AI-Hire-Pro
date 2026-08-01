import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';

import { CircularProgress } from '@/components/CandidateDashboard/CircularProgress';
import { DashboardMetricCard } from '@/components/CandidateDashboard/DashboardMetricCard';
import { DashboardSkeleton } from '@/components/CandidateDashboard/DashboardSkeleton';
import { QuickActions } from '@/components/CandidateDashboard/QuickActions';
import { RecentActivityTimeline } from '@/components/CandidateDashboard/RecentActivityTimeline';
import {
  CANDIDATE_ACTIVITY,
  CANDIDATE_MATCH_TREND,
  CANDIDATE_METRICS,
  CANDIDATE_QUICK_ACTIONS,
} from '@/constants/candidateDashboard';
import { useAuth } from '@/hooks/useAuth';

export function CandidateDashboardHome() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsLoading(false), 420);
    return () => window.clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="mt-6 space-y-6">
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 sm:p-6 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20"
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-normal text-cyan-700 dark:text-cyan-300">
              Candidate Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl dark:text-white">
              Welcome back{user ? `, ${user.first_name}` : ''}.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
              Track your job search foundation, profile strength, AI match signals, and next
              actions from one clean candidate workspace.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
            <CircularProgress label="Profile Completion" value={75} />
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CANDIDATE_METRICS.map((metric, index) => (
          <DashboardMetricCard index={index} key={metric.id} metric={metric} />
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-normal text-cyan-700 dark:text-cyan-300">
                Job Matches
              </p>
              <h2 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">
                Weekly AI match trend
              </h2>
            </div>
            <span className="rounded-md bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-200">
              +32% signal lift
            </span>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={CANDIDATE_MATCH_TREND} margin={{ bottom: 0, left: 0, right: 6, top: 8 }}>
                <defs>
                  <linearGradient id="candidateMatches" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.28)" />
                <XAxis
                  axisLine={false}
                  dataKey="label"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    border: '1px solid rgba(148, 163, 184, 0.35)',
                    borderRadius: 8,
                    boxShadow: '0 16px 40px rgba(15, 23, 42, 0.16)',
                  }}
                />
                <Area
                  dataKey="matches"
                  fill="url(#candidateMatches)"
                  stroke="#0891b2"
                  strokeWidth={3}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <QuickActions actions={CANDIDATE_QUICK_ACTIONS} />
      </div>

      <RecentActivityTimeline items={CANDIDATE_ACTIVITY} />
    </div>
  );
}
