import type { JobPosting } from '@/types/jobs';

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
