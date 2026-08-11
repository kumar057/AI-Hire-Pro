import type { CompanyJob, CompanyJobStatus } from '@/types/company';
import type { CompanyJobFormValues } from '@/validation/companyJobSchema';

function splitList(value: string) {
  return value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);
}

export function formValuesToJob(
  values: CompanyJobFormValues,
  status: CompanyJobStatus,
): CompanyJob {
  return {
    ...values,
    benefits: splitList(values.benefits),
    preferred_skills: splitList(values.preferred_skills),
    requirements: splitList(values.requirements),
    responsibilities: splitList(values.responsibilities),
    skills: splitList(values.skills),
    tags: splitList(values.tags),
    status,
  };
}

export function jobToFormValues(job: CompanyJob): CompanyJobFormValues {
  return {
    ...job,
    benefits: job.benefits.join('\n'),
    preferred_skills: job.preferred_skills.join(', '),
    requirements: job.requirements.join('\n'),
    responsibilities: job.responsibilities.join('\n'),
    skills: job.skills.join(', '),
    tags: job.tags.join(', '),
  };
}

