import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiFileText, FiSave, FiSend, FiUpload } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';

import { DiscoverySkeleton } from '@/components/JobDiscovery/DiscoverySkeleton';
import { applicationService } from '@/services/applicationService';
import { candidateService } from '@/services/candidateService';
import { jobService } from '@/services/jobService';
import type { CandidateResumeHistoryItem } from '@/types/candidateResume';
import type { JobPosting } from '@/types/jobs';
import { applicationSchema, type ApplicationFormValues } from '@/validation/applicationSchema';

export function ApplyJobPage() {
  const { jobId = '' } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobPosting>();
  const [resumes, setResumes] = useState<CandidateResumeHistoryItem[]>([]);
  const { formState: { errors, isSubmitting }, handleSubmit, register, watch } = useForm<ApplicationFormValues>({ resolver: zodResolver(applicationSchema), defaultValues: { cover_letter: '', resume_id: '' } });
  const coverLetter = watch('cover_letter');

  useEffect(() => { void Promise.all([jobService.getJob(jobId), candidateService.getResume()]).then(([jobData, resumeData]) => { setJob(jobData); setResumes(resumeData.history); }).catch(() => toast.error('Unable to prepare application.')); }, [jobId]);
  async function save(values: ApplicationFormValues, status: 'Draft' | 'Submitted') {
    await applicationService.create({ ...values, job_id: jobId, quick_apply: false, status });
    toast.success(status === 'Draft' ? 'Application draft saved.' : 'Application submitted.');
    navigate('/candidate/dashboard/application-history');
  }
  if (!job) return <div className="mt-6"><DiscoverySkeleton /></div>;

  return <motion.div animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-5" initial={{ opacity: 0, y: 12 }}>
    <header className="rounded-lg border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/70"><p className="text-sm font-bold uppercase text-cyan-700 dark:text-cyan-300">Job Application</p><h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Apply for {job.title}</h1><p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">{job.company} · {job.location}</p></header>
    <form className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]" onSubmit={handleSubmit((values) => save(values, 'Submitted'))}>
      <div className="space-y-5"><section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900/70"><h2 className="flex items-center gap-2 text-lg font-bold"><FiFileText className="text-cyan-600" />Choose resume</h2><div className="mt-4 grid gap-3">{resumes.slice(0, 3).map((resume) => <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3 has-[:checked]:border-cyan-400 has-[:checked]:bg-cyan-50 dark:border-white/10 dark:has-[:checked]:bg-cyan-300/10" key={resume.id}><input type="radio" value={resume.id} {...register('resume_id')} /><span><strong className="block text-sm">{resume.file_name}</strong><span className="text-xs text-slate-500">Uploaded {new Date(resume.upload_date).toLocaleDateString()}</span></span></label>)}</div>{errors.resume_id && <motion.p animate={{ opacity: 1 }} className="mt-2 text-sm font-semibold text-rose-600" initial={{ opacity: 0 }}>{errors.resume_id.message}</motion.p>}<button className="mt-4 flex items-center gap-2 text-sm font-bold text-cyan-700 dark:text-cyan-300" onClick={() => toast('Resume upload is a placeholder for this application step.')} type="button"><FiUpload />Upload new resume</button></section>
      <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900/70"><div className="flex items-center justify-between gap-3"><h2 className="text-lg font-bold">Cover letter</h2><span className="text-xs text-slate-500">{coverLetter.length}/5000</span></div><textarea className="mt-4 min-h-64 w-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-white/5" placeholder="Tell the hiring team why this role is a strong fit..." {...register('cover_letter')} />{errors.cover_letter && <p className="mt-2 text-sm font-semibold text-rose-600">{errors.cover_letter.message}</p>}</section></div>
      <aside className="sticky top-24 rounded-lg border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900/70"><h2 className="font-bold">Application summary</h2><dl className="mt-4 space-y-3 text-sm"><div><dt className="text-slate-500">Role</dt><dd className="font-bold">{job.title}</dd></div><div><dt className="text-slate-500">Company</dt><dd className="font-bold">{job.company}</dd></div><div><dt className="text-slate-500">Work mode</dt><dd className="font-bold">{job.work_mode}</dd></div></dl><button className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-cyan-600 font-bold text-white disabled:opacity-60" disabled={isSubmitting} type="submit"><FiSend />{isSubmitting ? 'Submitting...' : 'Submit application'}</button><button className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-300 font-bold dark:border-white/15" disabled={isSubmitting} onClick={handleSubmit((values) => save(values, 'Draft'))} type="button"><FiSave />Save draft</button><button className="mt-2 h-10 w-full text-sm font-bold text-slate-500" onClick={() => navigate(-1)} type="button">Cancel</button></aside>
    </form>
  </motion.div>;
}
