from typing import Annotated

from fastapi import APIRouter, Depends

from app.auth.dependencies import require_roles
from app.models.user import User, UserRole
from app.schemas.ai import ResumeAnalysisReport, ResumeAnalysisRequest

router = APIRouter(prefix="/ai")


@router.post("/resume-analysis")
async def analyze_resume(
    payload: ResumeAnalysisRequest,
    current_user: Annotated[User, Depends(require_roles(UserRole.CANDIDATE))],
) -> ResumeAnalysisReport:
    return _dummy_report(payload.resume_id, current_user.uuid)


@router.get("/report")
async def get_resume_report(
    current_user: Annotated[User, Depends(require_roles(UserRole.CANDIDATE))],
) -> ResumeAnalysisReport:
    return _dummy_report("resume-current", current_user.uuid)


def _dummy_report(resume_id: str, user_id: str) -> ResumeAnalysisReport:
    return ResumeAnalysisReport(
        id=f"report-{user_id[:8]}-{resume_id}",
        resume_name="Kumar_Product_Engineer_Resume.pdf",
        analyzed_at="2026-08-03T10:30:00Z",
        ats_score=86,
        job_match=82,
        resume_strength="Strong",
        metrics=[
            {"label": "Grammar", "score": 92, "summary": "Clear, professional language"},
            {"label": "Formatting", "score": 88, "summary": "Consistent and ATS friendly"},
            {"label": "Skill Match", "score": 84, "summary": "High role alignment"},
            {"label": "Impact", "score": 78, "summary": "Add more measurable outcomes"},
        ],
        radar={
            "Skills": 88,
            "Experience": 84,
            "Education": 76,
            "Projects": 90,
            "Keywords": 82,
            "Clarity": 92,
        },
        matched_skills=["React", "TypeScript", "Python", "FastAPI", "PostgreSQL", "Docker"],
        missing_skills=["Kubernetes", "AWS", "System Design"],
        suggested_skills=["Redis", "CI/CD", "Observability", "GraphQL"],
        keywords=[
            {"keyword": "React", "count": 7, "relevance": "High"},
            {"keyword": "TypeScript", "count": 5, "relevance": "High"},
            {"keyword": "API", "count": 6, "relevance": "High"},
            {"keyword": "Leadership", "count": 2, "relevance": "Medium"},
            {"keyword": "Cloud", "count": 1, "relevance": "Low"},
        ],
        strong_sections=[
            "Projects show clear ownership",
            "Technical skills are easy to scan",
            "Experience uses concise action verbs",
        ],
        weak_sections=[
            "Summary is too broad",
            "Two roles lack measurable outcomes",
            "Certifications need completion dates",
        ],
        sections=[
            {
                "name": "Education",
                "score": 82,
                "status": "Strong",
                "insight": "Relevant degree and coursework are clearly presented.",
            },
            {
                "name": "Experience",
                "score": 84,
                "status": "Strong",
                "insight": "Good progression; quantify business impact in two bullets.",
            },
            {
                "name": "Projects",
                "score": 90,
                "status": "Excellent",
                "insight": "Strong technical depth and ownership signals.",
            },
            {
                "name": "Certifications",
                "score": 68,
                "status": "Improve",
                "insight": "Add issuer, credential URL, and completion dates.",
            },
        ],
        improvements=[
            "Add measurable outcomes to each recent role.",
            "Tailor the summary to the target job title.",
            "Add Kubernetes and cloud deployment evidence.",
            "Keep the resume to two pages with consistent date formatting.",
        ],
        career_suggestions=[
            "Target product-led SaaS teams that value full-stack ownership.",
            "Highlight architecture decisions when applying to senior roles.",
            "Build one cloud-native project to strengthen platform credibility.",
        ],
        suggested_roles=[
            "Senior Frontend Engineer",
            "Full-Stack Engineer",
            "Product Engineer",
            "React Technical Lead",
        ],
    )
