import { describe, expect, it } from 'vitest';

import { EMPTY_DISCOVERY_FILTERS } from '@/constants/jobs';
import type { JobPosting } from '@/types/jobs';
import { filterDiscoveryJobs, paginateJobs, sortDiscoveryJobs } from '@/utils/jobs';

const jobs = [
  {
    id: 'remote-react', title: 'React Engineer', company: 'Alpha', location: 'Remote, India',
    country: 'India', state: 'Karnataka', city: 'Bengaluru', work_mode: 'Remote',
    employment_type: 'Full-time', experience_level: 'Senior', salary_min: 150000,
    salary_max: 190000, posted_at: '2026-08-01', match_score: 95, applicants: 80,
    skills: ['React', 'TypeScript'], department: 'Engineering', industry: 'Technology',
    education: "Bachelor's degree", notice_period: '30 days', company_size: '201-500',
    job_status: 'Open',
  },
  {
    id: 'hybrid-python', title: 'Python Engineer', company: 'Beta', location: 'Austin, TX',
    country: 'United States', state: 'Texas', city: 'Austin', work_mode: 'Hybrid',
    employment_type: 'Contract', experience_level: 'Mid', salary_min: 120000,
    salary_max: 145000, posted_at: '2026-07-20', match_score: 88, applicants: 120,
    skills: ['Python', 'FastAPI'], department: 'Platform', industry: 'Cloud',
    education: 'Equivalent experience', notice_period: 'Immediate', company_size: '51-200',
    job_status: 'Open',
  },
] as JobPosting[];

describe('job discovery utilities', () => {
  it('combines keyword and immediate structured filters', () => {
    const result = filterDiscoveryJobs(
      jobs,
      { ...EMPTY_DISCOVERY_FILTERS, country: 'India', workMode: 'Remote' },
      'React',
    );
    expect(result.map((job) => job.id)).toEqual(['remote-react']);
  });

  it('sorts by salary and most applied', () => {
    expect(sortDiscoveryJobs(jobs, 'salary-high')[0].id).toBe('remote-react');
    expect(sortDiscoveryJobs(jobs, 'most-applied')[0].id).toBe('hybrid-python');
  });

  it('paginates without mutating the result set', () => {
    expect(paginateJobs(jobs, 2, 1)[0].id).toBe('hybrid-python');
    expect(jobs).toHaveLength(2);
  });
});
