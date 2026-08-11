from pydantic import BaseModel, Field


class JobPosting(BaseModel):
    id: str
    title: str
    company: str
    location: str
    work_mode: str
    employment_type: str
    salary_range: str
    match_score: int = Field(ge=0, le=100)
    posted_at: str
    experience_level: str
    skills: list[str] = Field(default_factory=list)
    is_saved: bool = False
    is_applied: bool = False
    description: str
    company_logo: str = ""
    country: str = "United States"
    state: str = ""
    city: str = ""
    department: str = "Engineering"
    industry: str = "Technology"
    education: str = "Bachelor's degree or equivalent experience"
    notice_period: str = "30 days"
    company_size: str = "201-500"
    job_status: str = "Open"
    salary_min: int = 0
    salary_max: int = 0
    applicants: int = 0
    is_featured: bool = False
    responsibilities: list[str] = Field(default_factory=list)
    requirements: list[str] = Field(default_factory=list)
    benefits: list[str] = Field(default_factory=list)
    company_overview: str = ""
    company_rating: float = Field(default=4.5, ge=0, le=5)
    office_location: str = ""
    company_photos: list[str] = Field(default_factory=list)


class JobListResponse(BaseModel):
    jobs: list[JobPosting]
    total: int
    page: int
    page_size: int


class CandidateJobActionPayload(BaseModel):
    job_id: str = Field(min_length=1, max_length=80)


class CandidateJobActionResponse(BaseModel):
    job_id: str
    status: str
    message: str


class ApplicationTimelineItem(BaseModel):
    id: str
    label: str
    description: str
    occurred_at: str
    status: str


class CandidateApplication(BaseModel):
    id: str
    job: JobPosting
    status: str
    applied_at: str
    updated_at: str
    timeline: list[ApplicationTimelineItem] = Field(default_factory=list)


class CandidateAppliedJobsResponse(BaseModel):
    applications: list[CandidateApplication]
    total: int
    status_counts: dict[str, int]
    chart: list[dict[str, int | str]]
