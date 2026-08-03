import { describe, expect, it } from 'vitest';

import { formValuesToJob, jobToFormValues } from '@/utils/companyJobs';
import { companyJobSchema, type CompanyJobFormValues } from '@/validation/companyJobSchema';

const validJob: CompanyJobFormValues = {
  application_deadline: '2026-09-30',
  benefits: 'Health insurance\nLearning budget',
  category: 'Engineering',
  company: 'Northstar Labs',
  department: 'Platform',
  description: 'Build and operate reliable services for the AIHire Pro platform.',
  education: 'Equivalent professional experience',
  employment_type: 'Full-time',
  experience_level: 'Senior',
  location: 'Bengaluru, India',
  openings: 2,
  preferred_skills: 'Terraform, AWS',
  requirements: 'Five years of backend engineering experience',
  responsibilities: 'Own platform reliability and delivery standards',
  salary_range: 'INR 30L - 40L',
  skills: 'Python, Kubernetes',
  tags: 'Platform, Infrastructure',
  title: 'Platform Engineer',
  work_mode: 'Hybrid',
};

describe('company job form contract', () => {
  it('accepts a complete job and converts list fields for the API', () => {
    expect(companyJobSchema.safeParse(validJob).success).toBe(true);

    const job = formValuesToJob(validJob, 'published');

    expect(job.status).toBe('published');
    expect(job.skills).toEqual(['Python', 'Kubernetes']);
    expect(job.benefits).toEqual(['Health insurance', 'Learning budget']);
    expect(job.tags).toEqual(['Platform', 'Infrastructure']);
  });

  it('rejects incomplete descriptions and invalid opening counts', () => {
    const result = companyJobSchema.safeParse({
      ...validJob,
      description: 'Too short',
      openings: 0,
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual(
      expect.arrayContaining(['description', 'openings']),
    );
  });

  it('restores API list fields for editing', () => {
    const formValues = jobToFormValues(formValuesToJob(validJob, 'draft'));

    expect(formValues.skills).toBe('Python, Kubernetes');
    expect(formValues.responsibilities).toBe(
      'Own platform reliability and delivery standards',
    );
  });
});
