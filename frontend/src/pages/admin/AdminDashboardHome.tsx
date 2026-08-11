import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiActivity, FiAlertCircle, FiArrowUpRight, FiCheckCircle } from 'react-icons/fi';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AdminSkeleton } from '@/components/AdminDashboard/AdminSkeleton';
import { DashboardFeedWidgets } from '@/components/Notifications/DashboardFeedWidgets';
import { ADMIN_METRICS } from '@/constants/adminDashboard';
import { adminService } from '@/services/adminService';
import type { AdminDashboard } from '@/types/admin';

function Count({ value, prefix = '' }: { value: number; prefix?: string }) {
  const spring = useSpring(0, { stiffness: 70, damping: 18 });
  const shown = useTransform(spring, (latest) => `${prefix}${Math.round(latest).toLocaleString()}`);
  useEffect(() => spring.set(value), [spring, value]);
  return <motion.span>{shown}</motion.span>;
}
export function AdminDashboardHome() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  useEffect(() => {
    void adminService.getDashboard().then(setData);
  }, []);
  if (!data) return <AdminSkeleton />;
  return (
    <div className="mt-6 space-y-6">
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/70"
        initial={{ opacity: 0, y: 16 }}
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase text-rose-600 dark:text-rose-300">
              Admin Control Center
            </p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Platform overview</h1>
            <p className="mt-4 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
              Monitor growth, marketplace activity, trust signals, and operational health across
              AIHire Pro.
            </p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-300/20 dark:bg-emerald-300/10">
            <div className="flex items-center gap-3">
              <FiCheckCircle className="size-6 text-emerald-600" />
              <strong className="text-emerald-800 dark:text-emerald-200">
                All systems operational
              </strong>
            </div>
            <p className="mt-3 text-3xl font-bold text-emerald-700 dark:text-emerald-200">
              {data.summary.system_health}
            </p>
            <p className="mt-1 text-sm text-emerald-700">Thirty-day uptime</p>
          </div>
        </div>
      </motion.section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ADMIN_METRICS.map((metric, index) => {
          const Icon = metric.icon;
          const value = data.summary[metric.key];
          return (
            <motion.article
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70"
              initial={{ opacity: 0, y: 12 }}
              key={metric.key}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -3 }}
            >
              <div className="flex justify-between">
                <span className={`grid size-10 place-items-center rounded-lg ${metric.tone}`}>
                  <Icon />
                </span>
                <FiArrowUpRight className="text-slate-400" />
              </div>
              <p className="mt-4 text-2xl font-bold">
                {typeof value === 'number' ? (
                  <Count prefix={'prefix' in metric ? metric.prefix : ''} value={value} />
                ) : (
                  value
                )}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">
                {metric.label}
              </p>
            </motion.article>
          );
        })}
      </section>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartCard title="User growth">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={data.user_growth}>
              <defs>
                <linearGradient id="adminUsers" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#e11d48" stopOpacity={0.32} />
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(148,163,184,.25)" strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <Tooltip />
              <Area
                dataKey="users"
                fill="url(#adminUsers)"
                stroke="#e11d48"
                strokeWidth={3}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Top companies">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={data.top_companies} layout="vertical">
              <CartesianGrid stroke="rgba(148,163,184,.25)" strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={105} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="jobs" fill="#0891b2" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        <Signal
          icon={<FiActivity />}
          title="Active users rising"
          text="Daily active users increased 7.4% week over week."
        />
        <Signal
          icon={<FiCheckCircle />}
          title="Moderation queue healthy"
          text="92% of company reviews resolve within target SLA."
        />
        <Signal
          icon={<FiAlertCircle />}
          title="3 policy alerts"
          text="Review flagged job posts and unusual account activity."
        />
      </section>
      <DashboardFeedWidgets root="/admin/dashboard" />
    </div>
  );
}
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-5 h-72">{children}</div>
    </section>
  );
}
function Signal({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900/70">
      <span className="text-rose-600">{icon}</span>
      <h2 className="mt-3 font-bold">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">{text}</p>
    </article>
  );
}
