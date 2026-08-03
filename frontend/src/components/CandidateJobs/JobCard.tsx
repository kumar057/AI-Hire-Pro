import { motion } from 'framer-motion';
import { FiBookmark, FiBriefcase, FiCheckCircle, FiMapPin, FiSend } from 'react-icons/fi';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { JobPosting } from '@/types/jobs';

type JobCardProps = {
  index: number;
  job: JobPosting;
  onApply: (job: JobPosting) => void;
  onToggleSave: (job: JobPosting) => void;
};

export function JobCard({ index, job, onApply, onToggleSave }: JobCardProps) {
  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 18 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: 'easeOut' }}
    >
      <Card className="h-full gap-0 rounded-lg border-slate-200 bg-white p-5 py-5 shadow-sm shadow-slate-900/5 transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-950/10 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20">
        <div className="flex items-start justify-between gap-4">
          <span className="grid size-12 place-items-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-200">
            <FiBriefcase aria-hidden="true" className="size-5" />
          </span>
          <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-200" variant="secondary">
            {job.match_score}% match
          </Badge>
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">{job.title}</h2>
        <p className="mt-1 text-sm font-bold text-cyan-700 dark:text-cyan-300">{job.company}</p>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {job.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 dark:bg-white/10">
            <FiMapPin aria-hidden="true" />
            {job.location}
          </span>
          <span className="rounded-md bg-slate-100 px-2.5 py-1 dark:bg-white/10">{job.work_mode}</span>
          <span className="rounded-md bg-slate-100 px-2.5 py-1 dark:bg-white/10">{job.employment_type}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {job.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="outline">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
          <span className="font-bold text-slate-950 dark:text-white">{job.salary_range}</span>
          <div className="flex gap-2">
            <Button onClick={() => onToggleSave(job)} type="button" variant={job.is_saved ? 'secondary' : 'outline'}>
              {job.is_saved ? <FiCheckCircle aria-hidden="true" /> : <FiBookmark aria-hidden="true" />}
              {job.is_saved ? 'Saved' : 'Save'}
            </Button>
            <Button disabled={job.is_applied} onClick={() => onApply(job)} type="button">
              <FiSend aria-hidden="true" />
              {job.is_applied ? 'Applied' : 'Apply'}
            </Button>
          </div>
        </div>
      </Card>
    </motion.article>
  );
}
