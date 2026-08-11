import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiDownload, FiFileText, FiTrash2 } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';

import { ApplicationStatusBadge } from '@/components/Applications/ApplicationStatusBadge';
import { ApplicationTimeline } from '@/components/Applications/ApplicationTimeline';
import { DashboardSkeleton } from '@/components/CandidateDashboard/DashboardSkeleton';
import { applicationService } from '@/services/applicationService';
import type { JobApplication } from '@/types/applications';

export function CandidateApplicationDetailPage() {
  const { applicationId = '' } = useParams(); const navigate = useNavigate();
  const [application, setApplication] = useState<JobApplication>();
  useEffect(() => { void applicationService.getApplication(applicationId).then(setApplication).catch(() => toast.error('Unable to load application.')); }, [applicationId]);
  if (!application) return <DashboardSkeleton />;
  async function withdraw() { const current = application; if (!current) return; await applicationService.withdraw(current.id); setApplication({ ...current, status: 'Withdrawn' }); toast.success('Application withdrawn.'); }
  return <motion.div animate={{ opacity: 1 }} className="mt-6 space-y-5" initial={{ opacity: 0 }}><header className="rounded-lg border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/70"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-bold text-cyan-700">Application #{application.id}</p><h1 className="mt-2 text-3xl font-bold">{application.job.title}</h1><p className="mt-1 text-slate-600 dark:text-slate-300">{application.job.company}</p></div><ApplicationStatusBadge status={application.status} /></div></header><div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]"><section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900/70"><h2 className="text-xl font-bold">Application timeline</h2><div className="mt-5"><ApplicationTimeline events={application.timeline} /></div></section><aside className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900/70"><div><p className="text-xs font-bold uppercase text-slate-500">Submitted resume</p><p className="mt-1 flex items-center gap-2 font-bold"><FiFileText className="text-cyan-600" />{application.resume_name}</p></div><div><p className="text-xs font-bold uppercase text-slate-500">Cover letter</p><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{application.cover_letter || 'No cover letter added.'}</p></div><button className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-300 font-bold dark:border-white/15" onClick={() => toast.success('Application download placeholder prepared.')} type="button"><FiDownload />Download application</button>{!['Withdrawn', 'Rejected', 'Offer Accepted', 'Offer Rejected'].includes(application.status) && <button className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-rose-50 font-bold text-rose-700 dark:bg-rose-300/10 dark:text-rose-200" onClick={withdraw} type="button"><FiTrash2 />Withdraw application</button>}<button className="h-10 w-full text-sm font-bold text-slate-500" onClick={() => navigate(-1)} type="button">Back</button></aside></div></motion.div>;
}
