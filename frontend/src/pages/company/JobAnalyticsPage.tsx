import { useEffect, useState } from 'react';
import { FiBarChart2, FiEye, FiTarget, FiUsers } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CompanyPageHeader } from '@/components/CompanyDashboard/CompanyPageHeader';
import { CompanySkeleton } from '@/components/CompanyDashboard/CompanySkeleton';
import { companyService } from '@/services/companyService';
import type { CompanyJobAnalytics } from '@/types/company';

export function JobAnalyticsPage() {
  const { jobId = '' } = useParams();
  const [data, setData] = useState<CompanyJobAnalytics | null>(null);
  useEffect(() => { void companyService.getJobAnalytics(jobId).then(setData); }, [jobId]);
  if (!data) return <CompanySkeleton />;
  const metrics = [{ label: 'Views', value: data.views, icon: FiEye }, { label: 'Applications', value: data.applications, icon: FiUsers }, { label: 'Shortlisted', value: data.shortlisted, icon: FiTarget }, { label: 'Interviews', value: data.interviews, icon: FiBarChart2 }];
  return <div className="mt-6 space-y-6"><CompanyPageHeader description="Dummy performance signals for this job listing. Real analytics will be connected later." title="Job Analytics" /><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => { const Icon = metric.icon; return <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70" key={metric.label}><span className="grid size-10 place-items-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-200"><Icon /></span><p className="mt-4 text-2xl font-bold">{metric.value.toLocaleString()}</p><p className="mt-1 text-sm text-slate-500">{metric.label}</p></article>; })}</section><section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70"><div className="flex items-center justify-between"><h2 className="text-lg font-bold">Weekly performance</h2><span className="rounded-md bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-200">{data.conversion_rate}% conversion</span></div><div className="mt-5 h-80"><ResponsiveContainer height="100%" width="100%"><AreaChart data={data.trend}><CartesianGrid stroke="rgba(148,163,184,.25)" strokeDasharray="3 3" /><XAxis dataKey="label" /><YAxis /><Tooltip /><Area dataKey="views" fill="#06b6d433" stroke="#0891b2" strokeWidth={3} type="monotone" /><Area dataKey="applications" fill="#10b98133" stroke="#10b981" strokeWidth={3} type="monotone" /></AreaChart></ResponsiveContainer></div></section></div>;
}
