from pydantic import BaseModel, Field


class ResumeAnalysisRequest(BaseModel):
    resume_id: str = Field(default="resume-current", min_length=1, max_length=80)


class ScoreMetric(BaseModel):
    label: str
    score: int = Field(ge=0, le=100)
    summary: str


class ResumeSectionAnalysis(BaseModel):
    name: str
    score: int = Field(ge=0, le=100)
    status: str
    insight: str


class KeywordAnalysis(BaseModel):
    keyword: str
    count: int = Field(ge=0)
    relevance: str


class ResumeAnalysisReport(BaseModel):
    id: str
    resume_name: str
    analyzed_at: str
    ats_score: int = Field(ge=0, le=100)
    job_match: int = Field(ge=0, le=100)
    resume_strength: str
    metrics: list[ScoreMetric]
    radar: dict[str, int]
    matched_skills: list[str]
    missing_skills: list[str]
    suggested_skills: list[str]
    keywords: list[KeywordAnalysis]
    strong_sections: list[str]
    weak_sections: list[str]
    sections: list[ResumeSectionAnalysis]
    improvements: list[str]
    career_suggestions: list[str]
    suggested_roles: list[str]

