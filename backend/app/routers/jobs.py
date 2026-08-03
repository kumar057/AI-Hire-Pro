from fastapi import APIRouter, Query

from app.schemas.jobs import JobListResponse, JobPosting

router = APIRouter(prefix="/jobs")


@router.get("")
async def list_jobs(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=8, ge=1, le=50),
    search: str = "",
    location: str = "",
    sort: str = "match",
) -> JobListResponse:
    jobs = _jobs()
    if search:
        needle = search.lower()
        jobs = [
            job
            for job in jobs
            if needle in job.title.lower()
            or needle in job.company.lower()
            or any(needle in skill.lower() for skill in job.skills)
        ]

    if location:
        location_needle = location.lower()
        jobs = [job for job in jobs if location_needle in job.location.lower()]

    if sort == "newest":
        jobs = sorted(jobs, key=lambda job: job.posted_at, reverse=True)
    elif sort == "salary":
        jobs = sorted(jobs, key=lambda job: job.salary_range, reverse=True)
    else:
        jobs = sorted(jobs, key=lambda job: job.match_score, reverse=True)

    start = (page - 1) * page_size
    end = start + page_size
    return JobListResponse(jobs=jobs[start:end], total=len(jobs), page=page, page_size=page_size)


def _jobs() -> list[JobPosting]:
    return [
        JobPosting(
            id="job-001",
            title="Senior Frontend Engineer",
            company="SignalWorks",
            location="Remote, United States",
            work_mode="Remote",
            employment_type="Full-time",
            salary_range="$145k - $180k",
            match_score=97,
            posted_at="2026-08-01",
            experience_level="Senior",
            skills=["React", "TypeScript", "Design Systems", "Testing"],
            is_saved=True,
            is_applied=True,
            description="Build polished hiring workflows and scalable frontend architecture.",
        ),
        JobPosting(
            id="job-002",
            title="AI Product Engineer",
            company="Northstar Labs",
            location="San Francisco, CA",
            work_mode="Hybrid",
            employment_type="Full-time",
            salary_range="$160k - $210k",
            match_score=94,
            posted_at="2026-07-31",
            experience_level="Senior",
            skills=["React", "Python", "LLM UX", "FastAPI"],
            is_saved=False,
            is_applied=False,
            description="Prototype AI-assisted product surfaces for enterprise customers.",
        ),
        JobPosting(
            id="job-003",
            title="Full Stack Platform Engineer",
            company="CloudNest",
            location="Austin, TX",
            work_mode="Remote",
            employment_type="Full-time",
            salary_range="$135k - $170k",
            match_score=91,
            posted_at="2026-07-29",
            experience_level="Mid-Senior",
            skills=["FastAPI", "PostgreSQL", "React", "Docker"],
            is_saved=True,
            is_applied=False,
            description="Own product APIs and frontend dashboards for platform operations.",
        ),
        JobPosting(
            id="job-004",
            title="Design Systems Engineer",
            company="BrightHire",
            location="New York, NY",
            work_mode="Hybrid",
            employment_type="Contract",
            salary_range="$110k - $145k",
            match_score=89,
            posted_at="2026-07-27",
            experience_level="Mid-Senior",
            skills=["React", "Accessibility", "Tailwind", "Storybook"],
            is_saved=False,
            is_applied=True,
            description="Scale reusable UI components for a high-growth recruiting product.",
        ),
        JobPosting(
            id="job-005",
            title="Frontend Performance Engineer",
            company="VelocityAI",
            location="Seattle, WA",
            work_mode="Remote",
            employment_type="Full-time",
            salary_range="$150k - $190k",
            match_score=88,
            posted_at="2026-07-26",
            experience_level="Senior",
            skills=["React", "Vite", "Web Vitals", "TypeScript"],
            is_saved=False,
            is_applied=False,
            description="Improve dashboard load time, rendering quality, and observability.",
        ),
        JobPosting(
            id="job-006",
            title="Product UI Engineer",
            company="OrbitScale",
            location="Chicago, IL",
            work_mode="On-site",
            employment_type="Full-time",
            salary_range="$120k - $155k",
            match_score=84,
            posted_at="2026-07-24",
            experience_level="Mid",
            skills=["React", "UX", "Framer Motion", "Analytics"],
            is_saved=True,
            is_applied=False,
            description="Create premium product UI for hiring analytics and candidate workflows.",
        ),
        JobPosting(
            id="job-007",
            title="Backend API Engineer",
            company="TalentGrid",
            location="Remote, Canada",
            work_mode="Remote",
            employment_type="Full-time",
            salary_range="$125k - $165k",
            match_score=82,
            posted_at="2026-07-21",
            experience_level="Mid-Senior",
            skills=["FastAPI", "SQLAlchemy", "Alembic", "Security"],
            is_saved=False,
            is_applied=False,
            description="Build secure APIs for candidate, company, and admin modules.",
        ),
        JobPosting(
            id="job-008",
            title="Frontend Infrastructure Engineer",
            company="HireForge",
            location="Boston, MA",
            work_mode="Hybrid",
            employment_type="Full-time",
            salary_range="$140k - $175k",
            match_score=80,
            posted_at="2026-07-19",
            experience_level="Senior",
            skills=["React Router", "Testing", "Tooling", "Vite"],
            is_saved=False,
            is_applied=False,
            description="Improve routing, test reliability, build performance, and shared UI.",
        ),
    ]
