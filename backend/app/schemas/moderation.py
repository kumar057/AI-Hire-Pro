from typing import Literal

from pydantic import BaseModel, Field

ModerationStatus = Literal[
    "Pending", "Approved", "Rejected", "Flagged", "Suspended", "Archived", "Deleted"
]


class ModerationNote(BaseModel):
    id: str
    author: str
    content: str
    created_at: str


class ModerationJob(BaseModel):
    id: str
    title: str
    company: str
    company_id: str
    company_verified: bool
    company_violations: int
    category: str
    location: str
    employment_type: str
    salary: str
    skills: list[str]
    description: str
    benefits: list[str]
    posting_date: str
    status: ModerationStatus
    report_count: int = 0
    bookmarked: bool = False
    moderation_notes: list[ModerationNote] = Field(default_factory=list)


class ModerationJobList(BaseModel):
    jobs: list[ModerationJob]
    total: int
    status_counts: dict[str, int]


class ModerationActionPayload(BaseModel):
    reason: str = Field(default="", max_length=1000)


class ModerationNotePayload(BaseModel):
    content: str = Field(min_length=2, max_length=2000)


class JobReport(BaseModel):
    id: str
    job_id: str
    job_title: str
    company: str
    reason: str
    reporter: str
    report_date: str
    status: Literal["Open", "Investigating", "Resolved", "Dismissed"]
    resolution: str


class JobReportList(BaseModel):
    reports: list[JobReport]
    total: int


class CompanyViolation(BaseModel):
    id: str
    company: str
    violation: str
    severity: Literal["Low", "Medium", "High"]
    date: str
    status: str


class ModerationHistoryItem(BaseModel):
    id: str
    job_id: str
    job_title: str
    action: str
    moderator: str
    occurred_at: str
    note: str
