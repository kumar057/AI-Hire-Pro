import { useEffect, useState } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';
import { CompanyPageHeader } from '@/components/CompanyDashboard/CompanyPageHeader';
import { CompanySkeleton } from '@/components/CompanyDashboard/CompanySkeleton';
import { JobPreviewContent } from '@/components/CompanyJobs/JobPreviewContent';
import { companyService } from '@/services/companyService';
import type { CompanyJob } from '@/types/company';

export function JobPreviewPage() {
  const { jobId = '' } = useParams();
  const [job, setJob] = useState<CompanyJob | null>(null);
  useEffect(() => { void companyService.getJob(jobId).then(setJob); }, [jobId]);
  if (!job) return <CompanySkeleton />;
  return <div className="mt-6 space-y-6"><CompanyPageHeader action={<Link className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 font-bold text-white" to={`/company/dashboard/jobs/${jobId}/edit`}><FiEdit2 />Edit Job</Link>} description="Review the candidate-facing presentation before publishing or sharing the role." title="Job Preview" /><JobPreviewContent job={job} /></div>;
}

