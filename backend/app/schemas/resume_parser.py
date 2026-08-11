from __future__ import annotations

from pydantic import BaseModel, Field


class PersonalInfo(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""


class Skill(BaseModel):
    name: str
    category: str = ""  # e.g., "Technical", "Soft", "Programming"


class ExperienceItem(BaseModel):
    company: str
    job_title: str
    location: str = ""
    start_date: str = ""
    end_date: str = ""
    is_current: bool = False
    responsibilities: list[str] = []
    technologies: list[str] = []


class EducationItem(BaseModel):
    institution: str
    degree: str
    field_of_study: str = ""
    start_date: str = ""
    end_date: str = ""
    grade: str = ""


class ProjectItem(BaseModel):
    project_name: str
    description: str = ""
    technologies: list[str] = []
    project_url: str = ""


class CertificationItem(BaseModel):
    certification_name: str
    issuing_organization: str = ""
    issue_date: str = ""
    credential_id: str = ""
    credential_url: str = ""


class Links(BaseModel):
    linkedin: str = ""
    github: str = ""
    portfolio: str = ""
    other: list[str] = []


class ParsedResume(BaseModel):
    personal: PersonalInfo
    professional_summary: str = ""
    experience_years: int = 0
    skills: list[Skill] = []
    experience: list[ExperienceItem] = []
    education: list[EducationItem] = []
    projects: list[ProjectItem] = []
    certifications: list[CertificationItem] = []
    links: Links = Field(default_factory=Links)

    model_config = {"json_schema_extra": {"example": {
        "personal": {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "phone": "+1-555-0123",
            "location": "San Francisco, CA"
        },
        "professional_summary": "Experienced full-stack engineer...",
        "experience_years": 5,
        "skills": [
            {"name": "Python", "category": "Programming"},
            {"name": "React", "category": "Technical"}
        ],
        "experience": [
            {
                "company": "Tech Corp",
                "job_title": "Senior Engineer",
                "location": "SF, CA",
                "start_date": "2021-01",
                "end_date": "",
                "is_current": True,
                "responsibilities": ["Led team", "Built systems"],
                "technologies": ["Python", "React"]
            }
        ],
        "education": [
            {
                "institution": "UC Berkeley",
                "degree": "BS",
                "field_of_study": "Computer Science",
                "start_date": "2013-09",
                "end_date": "2017-05"
            }
        ],
        "projects": [],
        "certifications": [],
        "links": {
            "linkedin": "https://linkedin.com/in/jane",
            "github": "https://github.com/jane",
            "portfolio": "",
            "other": []
        }
    }}}


class ResumeParseRequest(BaseModel):
    """Request for resume parsing result preview."""
    pass


class ResumeParseResponse(BaseModel):
    """Response from resume parsing endpoint."""
    parsed_resume: ParsedResume
    extraction_confidence: float = Field(ge=0.0, le=1.0, default=0.85)
    extraction_notes: list[str] = []
