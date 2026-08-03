import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { CandidateAppliedJobsResponse } from '@/types/jobs';

type ApplicationChartProps = {
  data: CandidateAppliedJobsResponse['chart'];
};

export function ApplicationChart({ data }: ApplicationChartProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
      <p className="text-sm font-bold uppercase tracking-normal text-cyan-700 dark:text-cyan-300">
        Applications Chart
      </p>
      <h2 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">
        Monthly application volume
      </h2>
      <div className="mt-5 h-72">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.28)" strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} />
            <Tooltip />
            <Bar dataKey="applications" fill="#0891b2" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
