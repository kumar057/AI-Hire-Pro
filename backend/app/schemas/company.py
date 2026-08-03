from pydantic import BaseModel, Field, HttpUrl


class CompanyDashboardSummary(BaseModel):
    total_jobs: int
    active_jobs: int
    applications: int
    interviews: int
    hired_candidates: int
    company_views: int
    premium_status: str
    monthly_growth: int


class CompanyDashboardResponse(BaseModel):
    company_id: str
    company_name: str
    summary: CompanyDashboardSummary
    activity: list[dict[str, str]]


class CompanyProfilePayload(BaseModel):
    company_name: str = Field(min_length=2, max_length=160)
    industry: str = Field(min_length=2, max_length=100)
    company_size: str = Field(min_length=1, max_length=50)
    website: HttpUrl
    location: str = Field(min_length=2, max_length=160)
    founded_year: int = Field(ge=1800, le=2100)
    description: str = Field(min_length=20, max_length=2000)
    linkedin_url: HttpUrl | None = None
    twitter_url: HttpUrl | None = None
    benefits: list[str] = Field(default_factory=list)
    culture: list[str] = Field(default_factory=list)
    logo_url: str | None = None


class CompanyProfileResponse(CompanyProfilePayload):
    uuid: str


class CompanyJobPayload(BaseModel):
    title: str = Field(min_length=2, max_length=160)
    department: str = Field(min_length=2, max_length=100)
    employment_type: str
    experience_level: str
    salary_range: str
    location: str
    work_mode: str
    skills: list[str] = Field(min_length=1)
    education: str
    description: str = Field(min_length=20)
    responsibilities: list[str] = Field(min_length=1)
    requirements: list[str] = Field(min_length=1)
    benefits: list[str] = Field(default_factory=list)
    application_deadline: str
    status: str = "draft"


class CompanyJobResponse(CompanyJobPayload):
    id: str
    applications: int = 0
    views: int = 0
    created_at: str


class CompanyJobListResponse(BaseModel):
    jobs: list[CompanyJobResponse]
    total: int


class CompanyApplicant(BaseModel):
    id: str
    name: str
    role: str
    experience: str
    location: str
    match_score: int = Field(ge=0, le=100)
    status: str
    applied_at: str
    skills: list[str]


class CompanyApplicantListResponse(BaseModel):
    applicants: list[CompanyApplicant]
    total: int


class CompanyAnalyticsResponse(BaseModel):
    applications_trend: list[dict[str, int | str]]
    hiring_funnel: list[dict[str, int | str]]
    job_performance: list[dict[str, int | str]]

