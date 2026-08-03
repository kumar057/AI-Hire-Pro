import { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Funnel, FunnelChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { CompanyPageHeader } from '@/components/CompanyDashboard/CompanyPageHeader';
import { CompanySkeleton } from '@/components/CompanyDashboard/CompanySkeleton';
import { companyService } from '@/services/companyService';
import type { CompanyAnalytics } from '@/types/company';

const colors = ['#0891b2', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];
export function CompanyAnalyticsPage() {
  const [data, setData] = useState<CompanyAnalytics | null>(null);
  useEffect(() => { void companyService.getAnalytics().then(setData); }, []);
  if (!data) return <CompanySkeleton />;
  return <div className="mt-6 space-y-6"><CompanyPageHeader description="Understand candidate demand, conversion, and job-level hiring performance." title="Hiring Analytics" />
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70"><h2 className="text-lg font-bold">Applications and company views</h2><div className="mt-5 h-80"><ResponsiveContainer height="100%" width="100%"><AreaChart data={data.applications_trend}><defs><linearGradient id="applications" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.32} /><stop offset="95%" stopColor="#06b6d4" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="rgba(148,163,184,.25)" strokeDasharray="3 3" /><XAxis dataKey="label" /><YAxis /><Tooltip /><Area dataKey="applications" fill="url(#applications)" stroke="#0891b2" strokeWidth={3} type="monotone" /><Area dataKey="views" fill="transparent" stroke="#10b981" strokeWidth={2} type="monotone" /></AreaChart></ResponsiveContainer></div></section>
    <div className="grid gap-6 xl:grid-cols-2"><section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70"><h2 className="text-lg font-bold">Hiring funnel</h2><div className="mt-5 h-80"><ResponsiveContainer height="100%" width="100%"><FunnelChart><Tooltip /><Funnel dataKey="value" data={data.hiring_funnel} nameKey="stage"><LabelList dataKey="stage" fill="#fff" position="right" />{data.hiring_funnel.map((item, index) => <Cell fill={colors[index]} key={item.stage} />)}</Funnel></FunnelChart></ResponsiveContainer></div></section><section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70"><h2 className="text-lg font-bold">Job performance</h2><div className="mt-5 h-80"><ResponsiveContainer height="100%" width="100%"><BarChart data={data.job_performance} layout="vertical"><CartesianGrid stroke="rgba(148,163,184,.25)" strokeDasharray="3 3" /><XAxis type="number" /><YAxis dataKey="name" type="category" width={115} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="applications" fill="#0891b2" radius={[0, 4, 4, 0]} /><Bar dataKey="views" fill="#10b981" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></div></section></div>
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[{ label: 'Total Views', value: '12,840' }, { label: 'Job Clicks', value: '4,218' }, { label: 'Shortlisted', value: '124' }, { label: 'Rejected', value: '188' }].map((metric) => <article className="rounded-lg border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900/70" key={metric.label}><p className="text-sm font-bold text-slate-500">{metric.label}</p><p className="mt-2 text-2xl font-bold">{metric.value}</p></article>)}</section>
  </div>;
}

