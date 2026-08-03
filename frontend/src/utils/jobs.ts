import type { DiscoveryFilters, JobPosting } from '@/types/jobs';

export function filterJobs(
  jobs: JobPosting[],
  filters: {
    employmentType: string;
    location: string;
    search: string;
    sort: string;
    workMode: string;
  },
) {
  const search = filters.search.trim().toLowerCase();
  const location = filters.location.replace('All Locations', '').toLowerCase();
  const workMode = filters.workMode.replace('All Modes', '');
  const employmentType = filters.employmentType.replace('All Types', '');

  const filtered = jobs.filter((job) => {
    const matchesSearch =
      !search ||
      job.title.toLowerCase().includes(search) ||
      job.company.toLowerCase().includes(search) ||
      job.skills.some((skill) => skill.toLowerCase().includes(search));
    const matchesLocation = !location || job.location.toLowerCase().includes(location);
    const matchesMode = !workMode || job.work_mode === workMode;
    const matchesType = !employmentType || job.employment_type === employmentType;

    return matchesSearch && matchesLocation && matchesMode && matchesType;
  });

  return filtered.sort((a, b) => {
    if (filters.sort === 'newest') {
      return b.posted_at.localeCompare(a.posted_at);
    }

    if (filters.sort === 'salary') {
      return b.salary_range.localeCompare(a.salary_range);
    }

    return b.match_score - a.match_score;
  });
}

export function paginateJobs(jobs: JobPosting[], page: number, pageSize: number) {
  return jobs.slice((page - 1) * pageSize, page * pageSize);
}

export function filterDiscoveryJobs(jobs: JobPosting[], filters: DiscoveryFilters, query: string) {
  const includes = (value: string, needle: string) =>
    !needle || value.toLowerCase().includes(needle.toLowerCase());
  const search = query.trim().toLowerCase();
  const postedCutoff = filters.postedDate ? Number(filters.postedDate) : 0;

  return jobs.filter((job) => {
    const searchable = [job.title, job.company, job.location, ...job.skills].join(' ').toLowerCase();
    const salaryMatches = !filters.salary || job.salary_min >= Number(filters.salary);
    const postedMatches =
      !postedCutoff || Date.now() - new Date(job.posted_at).getTime() <= postedCutoff * 86400000;
    return (
      (!search || searchable.includes(search)) &&
      includes(job.title, filters.title) &&
      (!filters.skill || job.skills.some((skill) => includes(skill, filters.skill))) &&
      includes(job.company, filters.company) &&
      includes(job.location, filters.location) &&
      includes(job.country, filters.country) &&
      includes(job.state, filters.state) &&
      includes(job.city, filters.city) &&
      includes(job.work_mode, filters.workMode) &&
      includes(job.experience_level, filters.experience) &&
      salaryMatches &&
      includes(job.employment_type, filters.employmentType) &&
      includes(job.department, filters.department) &&
      includes(job.industry, filters.industry) &&
      includes(job.education, filters.education) &&
      includes(job.notice_period, filters.noticePeriod) &&
      postedMatches &&
      includes(job.company_size, filters.companySize) &&
      includes(job.job_status, filters.status)
    );
  });
}

export function sortDiscoveryJobs(jobs: JobPosting[], sort: string) {
  return [...jobs].sort((a, b) => {
    if (sort === 'latest') return b.posted_at.localeCompare(a.posted_at);
    if (sort === 'salary-high') return b.salary_max - a.salary_max;
    if (sort === 'salary-low') return a.salary_min - b.salary_min;
    if (sort === 'experience') return a.experience_level.localeCompare(b.experience_level);
    if (sort === 'company') return a.company.localeCompare(b.company);
    if (sort === 'most-applied') return b.applicants - a.applicants;
    return b.match_score - a.match_score;
  });
}
