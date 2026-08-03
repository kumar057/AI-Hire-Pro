from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.jobs import JobPosting

ApplicationStatus = Literal[
    "Draft",
    "Submitted",
    "Under Review",
    "Shortlisted",
    "Interview Scheduled",
    "Interview Completed",
    "Offer Sent",
    "Offer Accepted",
    "Offer Rejected",
    "Rejected",
    "Withdrawn",
]


class ApplicationTimelineEvent(BaseModel):
    id: str
    status: ApplicationStatus
    title: str
    description: str
    occurred_at: str
    completed: bool = True


class ApplicationCandidate(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    location: str
    headline: str
    experience: str
    skills: list[str] = Field(default_factory=list)
    match_score: int = Field(ge=0, le=100)


class JobApplicationCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    job_id: str = Field(min_length=1, max_length=80)
    resume_id: str = Field(min_length=1, max_length=80)
    cover_letter: str = Field(default="", max_length=5000)
    status: Literal["Draft", "Submitted"] = "Submitted"
    quick_apply: bool = False


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus
    note: str = Field(default="", max_length=1000)


class JobApplication(BaseModel):
    id: str
    candidate_id: str
    company_id: str
    job: JobPosting
    candidate: ApplicationCandidate
    resume_id: str
    resume_name: str
    cover_letter: str
    status: ApplicationStatus
    applied_at: str | None
    updated_at: str
    timeline: list[ApplicationTimelineEvent] = Field(default_factory=list)


class ApplicationListResponse(BaseModel):
    applications: list[JobApplication]
    total: int


class ApplicationDeleteResponse(BaseModel):
    id: str
    status: Literal["Withdrawn"]
    message: str
