import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';

export function ResumeRadarChart({ data }: { data: Record<string, number> }) {
  const chartData = Object.entries(data).map(([subject, score]) => ({ subject, score, fullMark: 100 }));

  return (
    <div className="h-80 w-full" aria-label="Resume category score radar chart">
      <ResponsiveContainer height="100%" width="100%">
        <RadarChart data={chartData} outerRadius="72%">
          <PolarGrid stroke="#94a3b8" strokeOpacity={0.35} />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip contentStyle={{ borderRadius: 8, borderColor: '#cbd5e1' }} />
          <Radar dataKey="score" fill="#06b6d4" fillOpacity={0.24} stroke="#0891b2" strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

