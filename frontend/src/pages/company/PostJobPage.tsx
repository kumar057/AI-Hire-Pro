import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiEye, FiSave, FiSend, FiX } from 'react-icons/fi';
import { z } from 'zod';

import { CompanyPageHeader } from '@/components/CompanyDashboard/CompanyPageHeader';
import { companyService } from '@/services/companyService';
import type { CompanyJob } from '@/types/company';

const schema = z.object({
  title: z.string().min(3, 'Job title is required'),
  department: z.string().min(2, 'Department is required'),
  employment_type: z.string().min(1),
  experience_level: z.string().min(1),
  salary_range: z.string().min(3, 'Salary range is required'),
  location: z.string().min(2, 'Location is required'),
  work_mode: z.string().min(1),
  skills: z.string().min(2, 'Add at least one skill'),
  education: z.string().min(2),
  description: z.string().min(20, 'Description must contain at least 20 characters'),
  responsibilities: z.string().min(5),
  requirements: z.string().min(5),
  benefits: z.string(),
  application_deadline: z.string().min(1, 'Deadline is required'),
});
type Values = z.infer<typeof schema>;
const input = 'mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-cyan-500 dark:border-white/15 dark:bg-white/5';
const textArea = 'mt-2 min-h-28 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none focus:border-cyan-500 dark:border-white/15 dark:bg-white/5';

export function PostJobPage() {
  const [preview, setPreview] = useState(false);
  const { register, handleSubmit, getValues, formState: { errors, isSubmitting }, reset } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { employment_type: 'Full-time', experience_level: 'Mid-level', work_mode: 'Hybrid', benefits: '' } });
  function payload(values: Values, status: string): CompanyJob { const lines = (value: string) => value.split(/\n|,/).map((item) => item.trim()).filter(Boolean); return { ...values, skills: lines(values.skills), responsibilities: lines(values.responsibilities), requirements: lines(values.requirements), benefits: lines(values.benefits), status }; }
  async function submit(values: Values, status = 'active') { await companyService.createJob(payload(values, status)); toast.success(status === 'draft' ? 'Job saved as draft.' : 'Job published successfully.'); reset(); }
  return <div className="mt-6 space-y-6"><CompanyPageHeader description="Create a clear, inclusive job post and publish it to your candidate pipeline." title="Post a Job" />
    <form className="space-y-6" onSubmit={handleSubmit((values) => submit(values))}>
      <JobSection title="Role details"><div className="grid gap-5 md:grid-cols-2"><Field error={errors.title?.message} label="Job Title"><input className={input} {...register('title')} /></Field><Field error={errors.department?.message} label="Department"><input className={input} {...register('department')} /></Field><Field label="Employment Type"><select className={input} {...register('employment_type')}><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option></select></Field><Field label="Experience Level"><select className={input} {...register('experience_level')}><option>Entry-level</option><option>Mid-level</option><option>Senior</option><option>Lead</option></select></Field><Field error={errors.salary_range?.message} label="Salary Range"><input className={input} placeholder="$120k-$160k" {...register('salary_range')} /></Field><Field error={errors.location?.message} label="Location"><input className={input} {...register('location')} /></Field><Field label="Work Mode"><select className={input} {...register('work_mode')}><option>Remote</option><option>Hybrid</option><option>Onsite</option></select></Field><Field error={errors.application_deadline?.message} label="Application Deadline"><input className={input} type="date" {...register('application_deadline')} /></Field></div></JobSection>
      <JobSection title="Candidate requirements"><div className="grid gap-5 md:grid-cols-2"><Field error={errors.skills?.message} label="Skills Required"><input className={input} placeholder="React, TypeScript, Testing" {...register('skills')} /></Field><Field error={errors.education?.message} label="Education"><input className={input} {...register('education')} /></Field></div><div className="mt-5"><Field error={errors.description?.message} label="Description"><textarea className={textArea} {...register('description')} /></Field></div><div className="mt-5 grid gap-5 lg:grid-cols-2"><Field error={errors.responsibilities?.message} label="Responsibilities"><textarea className={textArea} placeholder="One item per line" {...register('responsibilities')} /></Field><Field error={errors.requirements?.message} label="Requirements"><textarea className={textArea} placeholder="One item per line" {...register('requirements')} /></Field></div><div className="mt-5"><Field label="Benefits"><textarea className={textArea} placeholder="One item per line" {...register('benefits')} /></Field></div></JobSection>
      <div className="flex flex-wrap justify-end gap-3"><button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 font-bold dark:border-white/15" onClick={() => setPreview(true)} type="button"><FiEye />Preview</button><button className="inline-flex items-center gap-2 rounded-lg border border-cyan-600 px-4 py-2.5 font-bold text-cyan-700 dark:text-cyan-300" onClick={handleSubmit((values) => submit(values, 'draft'))} type="button"><FiSave />Save Draft</button><button className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 font-bold text-white disabled:opacity-50" disabled={isSubmitting} type="submit"><FiSend />Publish Job</button></div>
    </form>
    <AnimatePresence>{preview ? <PreviewModal onClose={() => setPreview(false)} values={getValues()} /> : null}</AnimatePresence>
  </div>;
}

function JobSection({ title, children }: { title: string; children: React.ReactNode }) { return <motion.section animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70" initial={{ opacity: 0, y: 12 }}><h2 className="text-lg font-bold">{title}</h2><div className="mt-5">{children}</div></motion.section>; }
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="text-sm font-bold text-slate-700 dark:text-slate-200">{label}{children}{error ? <span className="mt-1 block text-xs text-rose-600">{error}</span> : null}</label>; }
function PreviewModal({ values, onClose }: { values: Values; onClose: () => void }) { return <motion.div animate={{ opacity: 1 }} className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4" exit={{ opacity: 0 }} initial={{ opacity: 0 }}><motion.div animate={{ scale: 1 }} className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 text-slate-950 shadow-2xl dark:bg-slate-900 dark:text-white" initial={{ scale: 0.96 }}><div className="flex items-start justify-between"><div><p className="text-sm font-bold text-cyan-700">Job preview</p><h2 className="mt-2 text-2xl font-bold">{values.title || 'Untitled position'}</h2><p className="mt-2 text-sm text-slate-500">{values.department} / {values.location} / {values.work_mode}</p></div><button aria-label="Close preview" className="grid size-9 place-items-center" onClick={onClose} type="button"><FiX /></button></div><p className="mt-6 leading-7 text-slate-600 dark:text-slate-300">{values.description || 'Add a job description to preview it here.'}</p><div className="mt-5 flex flex-wrap gap-2">{values.skills?.split(',').map((skill) => <span className="rounded-md bg-cyan-50 px-3 py-1 text-sm font-bold text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-200" key={skill}>{skill.trim()}</span>)}</div></motion.div></motion.div>; }
