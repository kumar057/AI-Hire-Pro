from typing import Literal

from pydantic import BaseModel, Field, HttpUrl

from app.schemas.applications import ApplicationTimelineEvent

PipelineStage = Literal[
    "Applied",
    "Screening",
    "Shortlisted",
    "Technical Interview",
    "HR Interview",
    "Final Review",
    "Offer",
    "Hired",
    "Rejected",
]


class RecruiterNote(BaseModel):
    id: str
    author: str
    content: str
    created_at: str


class RecruiterCandidate(BaseModel):
    id: str
    application_id: str
    name: str
    email: str
    phone: str
    location: str
    headline: str
    experience: str
    education: list[str]
    certifications: list[str]
    skills: list[str]
    portfolio_url: HttpUrl | None = None
    github_url: HttpUrl | None = None
    linkedin_url: HttpUrl | None = None
    job_id: str
    job_title: str
    status: PipelineStage
    rating: int = Field(ge=1, le=5)
    tags: list[str] = Field(default_factory=list)
    bookmarked: bool = False
    resume_name: str
    cover_letter: str
    applied_at: str
    notes: list[RecruiterNote] = Field(default_factory=list)
    timeline: list[ApplicationTimelineEvent] = Field(default_factory=list)


class RecruiterCandidateList(BaseModel):
    candidates: list[RecruiterCandidate]
    total: int


class RecruiterStatusPayload(BaseModel):
    status: PipelineStage


class RecruiterNotePayload(BaseModel):
    content: str = Field(min_length=2, max_length=2000)


class RecruiterRatingPayload(BaseModel):
    rating: int = Field(ge=1, le=5)


class RecruiterCandidateUpdate(BaseModel):
    candidate_id: str
    message: str
    candidate: RecruiterCandidate
