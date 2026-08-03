import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiArrowUpRight, FiAward, FiZap } from 'react-icons/fi';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

import { CompanySkeleton } from '@/components/CompanyDashboard/CompanySkeleton';
import { COMPANY_METRICS } from '@/constants/companyDashboard';
import { companyService } from '@/services/companyService';
import type { CompanyDashboardResponse, CompanyDashboardSummary } from '@/types/company';

const trend = [{ label: 'Mar', value: 218 }, { label: 'Apr', value: 276 }, { label: 'May', value: 324 }, { label: 'Jun', value: 368 }, { label: 'Jul', value: 421 }, { label: 'Aug', value: 486 }];

function AnimatedValue({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 70, damping: 18 });
  const display = useTransform(spring, (latest) => Math.round(latest).toLocaleString());
  useEffect(() => spring.set(value), [spring, value]);
  return <motion.span>{display}</motion.span>;
}

export function CompanyDashboardHome() {
  const [data, setData] = useState<CompanyDashboardResponse | null>(null);
  useEffect(() => { void companyService.getDashboard().then(setData); }, []);
  if (!data) return <CompanySkeleton />;
  return <div className="mt-6 space-y-6">
    <motion.section animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/70" initial={{ opacity: 0, y: 16 }}>
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-center"><div><p className="text-sm font-bold uppercase text-cyan-700 dark:text-cyan-300">Company Dashboard</p><h1 className="mt-3 text-3xl font-bold sm:text-4xl">Welcome back, {data.company_name}.</h1><p className="mt-4 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">Monitor hiring performance, candidate flow, active jobs, and recruiter priorities from one focused workspace.</p></div><div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-300/20 dark:bg-emerald-300/10"><div className="flex items-center gap-3"><FiAward className="size-6 text-emerald-600" /><span className="font-bold text-emerald-800 dark:text-emerald-200">{data.summary.premium_status}</span></div><p className="mt-3 text-sm text-emerald-700 dark:text-emerald-200">Premium hiring tools active</p><div className="mt-4 flex items-center gap-2 font-bold text-emerald-700"><FiArrowUpRight />{data.summary.monthly_growth}% monthly growth</div></div></div>
    </motion.section>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{COMPANY_METRICS.map((metric, index) => { const Icon = metric.icon; const value = data.summary[metric.key as keyof CompanyDashboardSummary]; return <motion.article animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70" initial={{ opacity: 0, y: 14 }} key={metric.key} transition={{ delay: index * 0.05 }} whileHover={{ y: -3 }}><div className="flex items-start justify-between"><span className={`grid size-10 place-items-center rounded-lg ${metric.tone}`}><Icon /></span><FiArrowUpRight className="text-slate-400" /></div><p className="mt-4 text-2xl font-bold">{typeof value === 'number' ? <AnimatedValue value={value} /> : value}</p><p className="mt-1 font-bold text-slate-700 dark:text-slate-200">{metric.label}</p><p className="mt-1 text-xs text-slate-500">{metric.helper}</p></motion.article>; })}</section>
    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70"><div className="flex items-center justify-between"><div><p className="text-sm font-bold uppercase text-cyan-700 dark:text-cyan-300">Applications</p><h2 className="mt-2 text-xl font-bold">Six-month growth</h2></div><span className="rounded-md bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-200">+18%</span></div><div className="mt-5 h-72"><ResponsiveContainer height="100%" width="100%"><AreaChart data={trend}><defs><linearGradient id="companyTrend" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} /><stop offset="95%" stopColor="#06b6d4" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="rgba(148,163,184,.25)" strokeDasharray="3 3" /><XAxis axisLine={false} dataKey="label" tickLine={false} /><Tooltip /><Area dataKey="value" fill="url(#companyTrend)" stroke="#0891b2" strokeWidth={3} type="monotone" /></AreaChart></ResponsiveContainer></div></section>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70"><div className="flex items-center gap-3"><FiZap className="text-amber-500" /><h2 className="text-xl font-bold">Recent activity</h2></div><div className="mt-5 space-y-5">{data.activity.map((item) => <div className="border-l-2 border-cyan-500 pl-4" key={item.title}><p className="font-bold">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.time}</p></div>)}</div></section>
    </div>
  </div>;
}
