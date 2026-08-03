import { CompanyPageHeader } from '@/components/CompanyDashboard/CompanyPageHeader';
import { CompanyJobForm } from '@/components/CompanyJobs/CompanyJobForm';

export function PostJobPage() {
  return (
    <div className="mt-6 space-y-6">
      <CompanyPageHeader
        description="Create a complete job listing, save it as a draft, preview it, or publish it to candidates."
        title="Create Job"
      />
      <CompanyJobForm />
    </div>
  );
}
