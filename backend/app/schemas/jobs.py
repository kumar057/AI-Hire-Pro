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
