export const JOB_FILTERS = {
  employmentTypes: ['All Types', 'Full-time', 'Contract'],
  locations: ['All Locations', 'Remote', 'San Francisco', 'Austin', 'New York', 'Seattle'],
  sortOptions: [
    { label: 'Best match', value: 'match' },
    { label: 'Newest', value: 'newest' },
    { label: 'Salary', value: 'salary' },
  ],
  workModes: ['All Modes', 'Remote', 'Hybrid', 'On-site'],
};

export const JOBS_PAGE_SIZE = 6;

export const DISCOVERY_SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Latest', value: 'latest' },
  { label: 'Salary high to low', value: 'salary-high' },
  { label: 'Salary low to high', value: 'salary-low' },
  { label: 'Experience', value: 'experience' },
  { label: 'Company name', value: 'company' },
  { label: 'Most applied', value: 'most-applied' },
];

export const TRENDING_SEARCHES = ['React Engineer', 'Remote Python', 'Product Designer'];

export const EMPTY_DISCOVERY_FILTERS = {
  city: '', company: '', companySize: '', country: '', department: '', education: '',
  employmentType: '', experience: '', industry: '', location: '', noticePeriod: '',
  postedDate: '', salary: '', skill: '', state: '', status: '', title: '', workMode: '',
};
