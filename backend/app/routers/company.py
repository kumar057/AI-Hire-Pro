from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.auth.dependencies import require_roles
from app.models.user import User, UserRole
from app.schemas.company import (
    CompanyAnalyticsResponse,
    CompanyApplicantListResponse,
    CompanyDashboardResponse,
    CompanyJobListResponse,
    CompanyJobPayload,
    CompanyJobResponse,
    CompanyProfilePayload,
    CompanyProfileResponse,
)

router = APIRouter(prefix="/company")
CompanyUser = Annotated[User, Depends(require_roles(UserRole.COMPANY))]


@router.get("/dashboard")
async def get_company_dashboard(current_user: CompanyUser) -> CompanyDashboardResponse:
    return CompanyDashboardResponse(
        company_id=current_user.uuid,
        company_name="Northstar Labs",
        summary={
            "total_jobs": 24,
            "active_jobs": 8,
            "applications": 486,
            "interviews": 32,
            "hired_candidates": 14,
            "company_views": 12840,
            "premium_status": "Business Pro",
            "monthly_growth": 18,
        },
        activity=[
            {"title": "New candidate shortlisted", "time": "12 minutes ago"},
            {"title": "Senior Product Designer published", "time": "2 hours ago"},
            {"title": "Interview feedback submitted", "time": "Yesterday"},
        ],
    )


@router.get("/profile")
async def get_company_profile(current_user: CompanyUser) -> CompanyProfileResponse:
    return _profile(current_user.uuid)


@router.put("/profile")
async def update_company_profile(
    payload: CompanyProfilePayload, current_user: CompanyUser
) -> CompanyProfileResponse:
    return CompanyProfileResponse(uuid=current_user.uuid, **payload.model_dump())


@router.post("/jobs", status_code=status.HTTP_201_CREATED)
async def create_company_job(
    payload: CompanyJobPayload, current_user: CompanyUser
) -> CompanyJobResponse:
    return CompanyJobResponse(
        id=f"job-{current_user.uuid[:6]}-new",
        created_at="2026-08-03",
        **payload.model_dump(),
    )


@router.get("/jobs")
async def get_company_jobs(current_user: CompanyUser) -> CompanyJobListResponse:
    jobs = _jobs()
    return CompanyJobListResponse(jobs=jobs, total=len(jobs))


@router.put("/jobs/{job_id}")
async def update_company_job(
    job_id: str, payload: CompanyJobPayload, current_user: CompanyUser
) -> CompanyJobResponse:
    return CompanyJobResponse(
        id=job_id,
        created_at="2026-07-18",
        applications=42,
        views=1240,
        **payload.model_dump(),
    )


@router.delete("/jobs/{job_id}")
async def delete_company_job(job_id: str, current_user: CompanyUser) -> dict[str, str]:
    return {"id": job_id, "status": "deleted", "message": "Dummy job deleted"}


@router.get("/applicants")
async def get_company_applicants(current_user: CompanyUser) -> CompanyApplicantListResponse:
    applicants = [
        {
            "id": "app-1",
            "name": "Maya Chen",
            "role": "Senior Frontend Engineer",
            "experience": "7 years",
            "location": "Austin, TX",
            "match_score": 94,
            "status": "Shortlisted",
            "applied_at": "Aug 2, 2026",
            "skills": ["React", "TypeScript", "Design Systems"],
        },
        {
            "id": "app-2",
            "name": "Noah Williams",
            "role": "Product Designer",
            "experience": "5 years",
            "location": "Remote",
            "match_score": 89,
            "status": "Review",
            "applied_at": "Aug 2, 2026",
            "skills": ["Figma", "Research", "Prototyping"],
        },
        {
            "id": "app-3",
            "name": "Priya Kapoor",
            "role": "Backend Engineer",
            "experience": "6 years",
            "location": "New York, NY",
            "match_score": 91,
            "status": "Interview",
            "applied_at": "Aug 1, 2026",
            "skills": ["Python", "FastAPI", "PostgreSQL"],
        },
        {
            "id": "app-4",
            "name": "Liam Foster",
            "role": "Data Analyst",
            "experience": "4 years",
            "location": "Chicago, IL",
            "match_score": 82,
            "status": "New",
            "applied_at": "Jul 31, 2026",
            "skills": ["SQL", "Tableau", "Python"],
        },
    ]
    return CompanyApplicantListResponse(applicants=applicants, total=len(applicants))


@router.get("/analytics")
async def get_company_analytics(current_user: CompanyUser) -> CompanyAnalyticsResponse:
    return CompanyAnalyticsResponse(
        applications_trend=[
            {"label": "Mar", "applications": 210, "views": 4200},
            {"label": "Apr", "applications": 268, "views": 5100},
            {"label": "May", "applications": 312, "views": 6400},
            {"label": "Jun", "applications": 358, "views": 7900},
            {"label": "Jul", "applications": 421, "views": 9800},
            {"label": "Aug", "applications": 486, "views": 12840},
        ],
        hiring_funnel=[
            {"stage": "Applied", "value": 486},
            {"stage": "Reviewed", "value": 312},
            {"stage": "Shortlisted", "value": 124},
            {"stage": "Interviewed", "value": 58},
            {"stage": "Hired", "value": 14},
        ],
        job_performance=[
            {"name": "Frontend Engineer", "views": 3240, "applications": 142},
            {"name": "Product Designer", "views": 2480, "applications": 98},
            {"name": "Backend Engineer", "views": 2910, "applications": 121},
            {"name": "Data Analyst", "views": 1830, "applications": 74},
        ],
    )


def _profile(user_id: str) -> CompanyProfileResponse:
    return CompanyProfileResponse(
        uuid=user_id,
        company_name="Northstar Labs",
        industry="Software and AI",
        company_size="201-500",
        website="https://northstar.example.com",
        location="San Francisco, California",
        founded_year=2018,
        description=(
            "Northstar Labs builds responsible AI products that help modern teams make "
            "better decisions and deliver exceptional customer experiences."
        ),
        linkedin_url="https://www.linkedin.com/company/northstar-labs",
        twitter_url="https://x.com/northstarlabs",
        benefits=["Remote-first", "Health coverage", "Learning budget", "Flexible PTO"],
        culture=["Customer empathy", "Craft excellence", "Inclusive teams"],
        logo_url=None,
    )


def _jobs() -> list[CompanyJobResponse]:
    base = {
        "employment_type": "Full-time",
        "experience_level": "Senior",
        "salary_range": "$140k-$180k",
        "location": "San Francisco, CA",
        "work_mode": "Hybrid",
        "skills": ["React", "TypeScript"],
        "education": "Bachelor's degree or equivalent experience",
        "description": "Build high-quality product experiences for a growing enterprise platform.",
        "responsibilities": ["Own product delivery", "Mentor engineers"],
        "requirements": ["5+ years of experience", "Strong communication"],
        "benefits": ["Health coverage", "Learning budget"],
        "application_deadline": "2026-09-15",
    }
    return [
        CompanyJobResponse(
            id="company-job-1",
            title="Senior Frontend Engineer",
            department="Engineering",
            status="active",
            applications=142,
            views=3240,
            created_at="2026-07-18",
            **base,
        ),
        CompanyJobResponse(
            id="company-job-2",
            title="Product Designer",
            department="Design",
            status="active",
            applications=98,
            views=2480,
            created_at="2026-07-22",
            **{**base, "skills": ["Figma", "Research"]},
        ),
        CompanyJobResponse(
            id="company-job-3",
            title="Backend Engineer",
            department="Engineering",
            status="draft",
            applications=0,
            views=0,
            created_at="2026-08-01",
            **{**base, "skills": ["Python", "FastAPI"]},
        ),
        CompanyJobResponse(
            id="company-job-4",
            title="Data Analyst",
            department="Data",
            status="closed",
            applications=74,
            views=1830,
            created_at="2026-06-30",
            **{**base, "skills": ["SQL", "Tableau"]},
        ),
    ]
