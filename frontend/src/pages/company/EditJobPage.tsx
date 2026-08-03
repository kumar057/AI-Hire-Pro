import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CompanyPageHeader } from '@/components/CompanyDashboard/CompanyPageHeader';
import { CompanySkeleton } from '@/components/CompanyDashboard/CompanySkeleton';
import { CompanyJobForm } from '@/components/CompanyJobs/CompanyJobForm';
import { companyService } from '@/services/companyService';
import type { CompanyJob } from '@/types/company';

export function EditJobPage() {
  const { jobId = '' } = useParams();
  const [job, setJob] = useState<CompanyJob | null>(null);
  useEffect(() => { void companyService.getJob(jobId).then(setJob); }, [jobId]);
  if (!job) return <CompanySkeleton />;
  return <div className="mt-6 space-y-6"><CompanyPageHeader description="Update job details, retain a draft, or publish the latest version." title="Edit Job" /><CompanyJobForm initialJob={job} jobId={jobId} /></div>;
}

