import { FiBriefcase, FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';
import type { CompanyJob } from '@/types/company';

export function JobPreviewContent({ job }: { job: CompanyJob }) {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900/70">
      <header className="border-b border-slate-200 p-6 dark:border-white/10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="rounded-md bg-cyan-50 px-2 py-1 text-xs font-bold capitalize text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-200">{job.status}</span>
            <h1 className="mt-4 text-3xl font-bold text-slate-950 dark:text-white">{job.title || 'Untitled position'}</h1>
            <p className="mt-2 font-semibold text-slate-600 dark:text-slate-300">{job.company}</p>
          </div>
          <div className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white dark:bg-white dark:text-slate-950">{job.salary_range}</div>
        </div>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-2"><FiMapPin />{job.location} / {job.work_mode}</span>
          <span className="flex items-center gap-2"><FiBriefcase />{job.employment_type} / {job.experience_level}</span>
          <span className="flex items-center gap-2"><FiUsers />{job.openings} opening{job.openings === 1 ? '' : 's'}</span>
          <span className="flex items-center gap-2"><FiCalendar />Apply by {job.application_deadline}</span>
        </div>
      </header>
      <div className="grid gap-8 p-6 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-8">
          <Section title="About the role"><p className="whitespace-pre-wrap leading-7 text-slate-600 dark:text-slate-300">{job.description}</p></Section>
          <ListSection items={job.responsibilities} title="Responsibilities" />
          <ListSection items={job.requirements} title="Requirements" />
          <ListSection items={job.benefits} title="Benefits" />
        </div>
        <aside className="space-y-5">
          <TagPanel items={job.skills} title="Required Skills" tone="cyan" />
          <TagPanel items={job.preferred_skills} title="Preferred Skills" tone="emerald" />
          <TagPanel items={job.tags} title="Tags" tone="slate" />
          <div className="rounded-lg border border-slate-200 p-4 text-sm dark:border-white/10"><p className="font-bold">Category</p><p className="mt-1 text-slate-500">{job.category}</p><p className="mt-4 font-bold">Education</p><p className="mt-1 text-slate-500">{job.education}</p></div>
        </aside>
      </div>
    </article>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) { return <section><h2 className="text-xl font-bold">{title}</h2><div className="mt-3">{children}</div></section>; }
function ListSection({ title, items }: { title: string; items: string[] }) { return <Section title={title}><ul className="space-y-2 text-slate-600 dark:text-slate-300">{items.map((item) => <li className="flex gap-3" key={item}><span className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan-500" />{item}</li>)}</ul></Section>; }
function TagPanel({ title, items, tone }: { title: string; items: string[]; tone: 'cyan' | 'emerald' | 'slate' }) { const tones = { cyan: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-200', emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-200', slate: 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200' }; return <section><h2 className="text-sm font-bold">{title}</h2><div className="mt-2 flex flex-wrap gap-2">{items.map((item) => <span className={`rounded-md px-2 py-1 text-xs font-bold ${tones[tone]}`} key={item}>{item}</span>)}</div></section>; }

