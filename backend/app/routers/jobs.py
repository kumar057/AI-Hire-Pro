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
        needles = search.lower().split()
        jobs = [
            job
            for job in jobs
            if all(
                needle
                in " ".join([job.title, job.company, job.location, *job.skills]).lower()
                for needle in needles
            )
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


@router.get("/search")
async def search_jobs(
    q: str = "",
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=8, ge=1, le=50),
) -> JobListResponse:
    return await list_jobs(page=page, page_size=page_size, search=q)


@router.get("/featured")
async def featured_jobs() -> JobListResponse:
    jobs = [job for job in _jobs() if job.is_featured]
    return JobListResponse(jobs=jobs, total=len(jobs), page=1, page_size=len(jobs))


@router.get("/similar/{job_id}")
async def similar_jobs(job_id: str) -> JobListResponse:
    jobs = _jobs()
    current = next((job for job in jobs if job.id == job_id), jobs[0])
    similar = [
        job
        for job in jobs
        if job.id != current.id
        and (job.department == current.department or set(job.skills) & set(current.skills))
    ][:4]
    return JobListResponse(jobs=similar, total=len(similar), page=1, page_size=len(similar))


@router.get("/{job_id}")
async def job_detail(job_id: str) -> JobPosting:
    jobs = _jobs()
    return next((job for job in jobs if job.id == job_id), jobs[0])


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
            city="Remote",
            department="Product Engineering",
            industry="HR Technology",
            salary_min=145000,
            salary_max=180000,
            applicants=86,
            is_featured=True,
            responsibilities=[
                "Lead frontend architecture",
                "Mentor engineers",
                "Own design-system quality",
            ],
            requirements=[
                "5+ years with React",
                "Advanced TypeScript",
                "Strong accessibility practice",
            ],
            benefits=["Remote stipend", "Health coverage", "Learning budget", "Flexible leave"],
            company_overview="SignalWorks builds dependable hiring software for distributed teams.",
            company_rating=4.8,
            office_location="Distributed across the United States",
            company_photos=["Product studio", "Team collaboration", "Remote meetup"],
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
            city="San Francisco",
            state="California",
            department="AI Products",
            industry="Artificial Intelligence",
            salary_min=160000,
            salary_max=210000,
            applicants=124,
            is_featured=True,
            responsibilities=[
                "Prototype AI workflows",
                "Partner with product design",
                "Ship secure APIs",
            ],
            requirements=["React and Python expertise", "Product experimentation experience"],
            benefits=["Equity", "Medical coverage", "Annual retreat"],
            company_overview="Northstar Labs creates practical AI systems for enterprise teams.",
            company_rating=4.7,
            office_location="Mission District, San Francisco",
            company_photos=["AI lab", "Design review", "San Francisco office"],
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
            city="Austin",
            state="Texas",
            department="Platform Engineering",
            industry="Cloud Infrastructure",
            salary_min=135000,
            salary_max=170000,
            applicants=67,
            is_featured=True,
            responsibilities=["Build platform APIs", "Improve observability", "Own releases"],
            requirements=["FastAPI experience", "PostgreSQL expertise", "Cloud fundamentals"],
            benefits=["Remote first", "Home office budget", "401(k) match"],
            company_overview="CloudNest helps engineering teams operate reliable cloud platforms.",
            company_rating=4.6,
            office_location="Downtown Austin, Texas",
            company_photos=["Austin hub", "Platform team", "Engineering workshop"],
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
            city="New York",
            state="New York",
            department="Design Systems",
            industry="HR Technology",
            salary_min=110000,
            salary_max=145000,
            applicants=53,
            responsibilities=["Build accessible components", "Maintain UI documentation"],
            requirements=["Design systems experience", "WCAG knowledge"],
            benefits=["Transit benefit", "Flexible schedule"],
            company_overview=(
                "BrightHire improves structured interviewing for modern organizations."
            ),
            company_rating=4.5,
            office_location="Flatiron District, New York",
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
            city="Seattle",
            state="Washington",
            department="Web Platform",
            industry="Artificial Intelligence",
            salary_min=150000,
            salary_max=190000,
            applicants=91,
            is_featured=True,
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
            city="Chicago",
            state="Illinois",
            department="Product Engineering",
            salary_min=120000,
            salary_max=155000,
            applicants=42,
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
            country="Canada",
            city="Remote",
            department="Backend Engineering",
            industry="HR Technology",
            salary_min=125000,
            salary_max=165000,
            applicants=38,
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
            city="Boston",
            state="Massachusetts",
            department="Developer Experience",
            salary_min=140000,
            salary_max=175000,
            applicants=49,
        ),
    ]
