from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.dependencies import require_roles
from app.models.user import User, UserRole
from app.schemas.admin import (
    AdminCollectionResponse,
    AdminDashboardResponse,
    AdminReportsResponse,
)
from app.schemas.moderation import (
    CompanyViolation,
    JobReport,
    JobReportList,
    ModerationActionPayload,
    ModerationHistoryItem,
    ModerationJob,
    ModerationJobList,
    ModerationNote,
    ModerationNotePayload,
)

router = APIRouter(prefix="/admin")
AdminUser = Annotated[User, Depends(require_roles(UserRole.ADMIN))]


@router.get("/dashboard")
async def get_admin_dashboard(current_user: AdminUser) -> AdminDashboardResponse:
    return AdminDashboardResponse(
        summary={
            "total_users": 128420,
            "candidates": 112860,
            "companies": 15560,
            "jobs": 48320,
            "applications": 684250,
            "revenue": 1240000,
            "daily_active_users": 28460,
            "system_health": "99.98%",
        },
        user_growth=_series("users", [72, 81, 89, 98, 112, 128]),
        job_growth=_series("jobs", [24, 29, 34, 39, 44, 48]),
        application_trend=_series("applications", [310, 372, 428, 501, 592, 684]),
        top_companies=[
            {"name": "Northstar Labs", "jobs": 84},
            {"name": "SignalWorks", "jobs": 72},
            {"name": "Vertex Cloud", "jobs": 63},
            {"name": "Lumina Health", "jobs": 51},
        ],
        most_applied_jobs=[
            {"name": "Frontend Engineer", "applications": 3840},
            {"name": "Product Designer", "applications": 3120},
            {"name": "Data Analyst", "applications": 2840},
            {"name": "Backend Engineer", "applications": 2610},
        ],
        active_users=[
            {"label": "Mon", "users": 21400},
            {"label": "Tue", "users": 23900},
            {"label": "Wed", "users": 25100},
            {"label": "Thu", "users": 26800},
            {"label": "Fri", "users": 28460},
        ],
    )


@router.get("/users")
async def get_admin_users(current_user: AdminUser) -> AdminCollectionResponse:
    items = [
        {
            "id": "usr-1",
            "name": "Ava Stone",
            "email": "ava@example.com",
            "role": "Candidate",
            "status": "Active",
            "joined": "Aug 1, 2026",
        },
        {
            "id": "usr-2",
            "name": "Morgan Reed",
            "email": "morgan@northstar.io",
            "role": "Company",
            "status": "Active",
            "joined": "Jul 28, 2026",
        },
        {
            "id": "usr-3",
            "name": "Maya Chen",
            "email": "maya@example.com",
            "role": "Candidate",
            "status": "Pending",
            "joined": "Jul 26, 2026",
        },
        {
            "id": "usr-4",
            "name": "Noah Williams",
            "email": "noah@example.com",
            "role": "Candidate",
            "status": "Suspended",
            "joined": "Jul 21, 2026",
        },
        {
            "id": "usr-5",
            "name": "Priya Kapoor",
            "email": "priya@example.com",
            "role": "Candidate",
            "status": "Active",
            "joined": "Jul 18, 2026",
        },
        {
            "id": "usr-6",
            "name": "Vertex Hiring",
            "email": "talent@vertex.io",
            "role": "Company",
            "status": "Active",
            "joined": "Jul 12, 2026",
        },
    ]
    return AdminCollectionResponse(items=items, total=len(items))


@router.get("/companies")
async def get_admin_companies(current_user: AdminUser) -> AdminCollectionResponse:
    items = [
        {
            "id": "com-1",
            "name": "Northstar Labs",
            "industry": "Software and AI",
            "jobs": 24,
            "status": "Verified",
            "plan": "Business Pro",
        },
        {
            "id": "com-2",
            "name": "SignalWorks",
            "industry": "SaaS",
            "jobs": 18,
            "status": "Verified",
            "plan": "Enterprise",
        },
        {
            "id": "com-3",
            "name": "Vertex Cloud",
            "industry": "Cloud Infrastructure",
            "jobs": 16,
            "status": "Review",
            "plan": "Business Pro",
        },
        {
            "id": "com-4",
            "name": "Lumina Health",
            "industry": "Healthcare",
            "jobs": 12,
            "status": "Verified",
            "plan": "Starter",
        },
        {
            "id": "com-5",
            "name": "Atlas Retail",
            "industry": "Commerce",
            "jobs": 9,
            "status": "Suspended",
            "plan": "Starter",
        },
    ]
    return AdminCollectionResponse(items=items, total=len(items))


@router.get("/jobs")
async def get_admin_jobs(current_user: AdminUser) -> ModerationJobList:
    jobs = _moderation_jobs()
    counts = {status: sum(job.status == status for job in jobs) for status in [
        "Pending", "Approved", "Rejected", "Flagged", "Suspended", "Archived", "Deleted"
    ]}
    return ModerationJobList(jobs=jobs, total=len(jobs), status_counts=counts)


@router.get("/jobs/{job_id}")
async def get_admin_job(job_id: str, current_user: AdminUser) -> ModerationJob:
    job = next((item for item in _moderation_jobs() if item.id == job_id), None)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job


@router.patch("/jobs/{job_id}/approve")
async def approve_admin_job(job_id: str, current_user: AdminUser) -> ModerationJob:
    return (await get_admin_job(job_id, current_user)).model_copy(update={"status": "Approved"})


@router.patch("/jobs/{job_id}/reject")
async def reject_admin_job(
    job_id: str, payload: ModerationActionPayload, current_user: AdminUser
) -> ModerationJob:
    return (await get_admin_job(job_id, current_user)).model_copy(update={"status": "Rejected"})


@router.patch("/jobs/{job_id}/suspend")
async def suspend_admin_job(
    job_id: str, payload: ModerationActionPayload, current_user: AdminUser
) -> ModerationJob:
    return (await get_admin_job(job_id, current_user)).model_copy(update={"status": "Suspended"})


@router.patch("/jobs/{job_id}/archive")
async def archive_admin_job(job_id: str, current_user: AdminUser) -> ModerationJob:
    return (await get_admin_job(job_id, current_user)).model_copy(update={"status": "Archived"})


@router.patch("/jobs/{job_id}/restore")
async def restore_admin_job(job_id: str, current_user: AdminUser) -> ModerationJob:
    return (await get_admin_job(job_id, current_user)).model_copy(update={"status": "Approved"})


@router.patch("/jobs/{job_id}/request-changes")
async def request_admin_job_changes(
    job_id: str, payload: ModerationActionPayload, current_user: AdminUser
) -> ModerationJob:
    return (await get_admin_job(job_id, current_user)).model_copy(update={"status": "Pending"})


@router.post("/jobs/{job_id}/notes")
async def add_admin_job_note(
    job_id: str, payload: ModerationNotePayload, current_user: AdminUser
) -> ModerationJob:
    job = await get_admin_job(job_id, current_user)
    note = ModerationNote(
        id=f"note-{job_id}-new",
        author="Platform Moderator",
        content=payload.content,
        created_at="2026-08-03T16:00:00+00:00",
    )
    return job.model_copy(update={"moderation_notes": [*job.moderation_notes, note]})


@router.get("/job-reports")
async def get_admin_job_reports(current_user: AdminUser) -> JobReportList:
    reports = _job_reports()
    return JobReportList(reports=reports, total=len(reports))


@router.get("/company-violations")
async def get_company_violations(current_user: AdminUser) -> list[CompanyViolation]:
    return [
        CompanyViolation(
            id="vio-1", company="Vertex Cloud", violation="Misleading salary range",
            severity="High", date="2026-08-01", status="Open",
        ),
        CompanyViolation(
            id="vio-2", company="Atlas Retail", violation="Duplicate job postings",
            severity="Medium", date="2026-07-29", status="Investigating",
        ),
    ]


@router.get("/moderation-history")
async def get_moderation_history(current_user: AdminUser) -> list[ModerationHistoryItem]:
    return [
        ModerationHistoryItem(
            id="hist-1", job_id="mod-job-2", job_title="Product Designer",
            action="Approved", moderator="Alex Morgan",
            occurred_at="2026-08-03T11:30:00Z", note="Policy checks passed.",
        ),
        ModerationHistoryItem(
            id="hist-2", job_id="mod-job-4", job_title="Data Analyst",
            action="Archived", moderator="Sam Rivera",
            occurred_at="2026-08-02T14:15:00Z", note="Posting expired.",
        ),
    ]


@router.get("/applications")
async def get_admin_applications(current_user: AdminUser) -> AdminCollectionResponse:
    items = [
        {
            "id": "apl-1",
            "candidate": "Maya Chen",
            "job": "Senior Frontend Engineer",
            "company": "Northstar Labs",
            "status": "Interview",
            "applied": "Aug 2, 2026",
        },
        {
            "id": "apl-2",
            "candidate": "Noah Williams",
            "job": "Product Designer",
            "company": "SignalWorks",
            "status": "Shortlisted",
            "applied": "Aug 2, 2026",
        },
        {
            "id": "apl-3",
            "candidate": "Priya Kapoor",
            "job": "Backend Engineer",
            "company": "Vertex Cloud",
            "status": "Review",
            "applied": "Aug 1, 2026",
        },
        {
            "id": "apl-4",
            "candidate": "Liam Foster",
            "job": "Data Analyst",
            "company": "Lumina Health",
            "status": "Rejected",
            "applied": "Jul 31, 2026",
        },
    ]
    return AdminCollectionResponse(items=items, total=len(items))


@router.get("/reports")
async def get_admin_reports(current_user: AdminUser) -> AdminReportsResponse:
    return AdminReportsResponse(
        generated_at="2026-08-03T12:00:00Z",
        reports=[
            {
                "id": "rep-1",
                "name": "Monthly platform performance",
                "category": "Operations",
                "status": "Ready",
                "period": "July 2026",
            },
            {
                "id": "rep-2",
                "name": "User growth and retention",
                "category": "Users",
                "status": "Ready",
                "period": "Q2 2026",
            },
            {
                "id": "rep-3",
                "name": "Employer revenue summary",
                "category": "Revenue",
                "status": "Processing",
                "period": "July 2026",
            },
        ],
    )


def _series(key: str, values: list[int]) -> list[dict[str, int | str]]:
    labels = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"]
    return [{"label": label, key: value} for label, value in zip(labels, values, strict=True)]


def _moderation_jobs() -> list[ModerationJob]:
    statuses = [
        "Pending", "Approved", "Rejected", "Flagged", "Suspended", "Archived", "Deleted",
    ]
    titles = [
        "Senior Frontend Engineer", "Product Designer", "Backend Engineer",
        "Data Analyst", "Platform Engineer", "Growth Lead", "Cloud Architect",
    ]
    companies = [
        "Northstar Labs", "SignalWorks", "Vertex Cloud", "Lumina Health",
        "Atlas Retail", "BrightHire", "CloudNest",
    ]
    return [
        ModerationJob(
            id=f"mod-job-{index + 1}", title=titles[index], company=companies[index],
            company_id=f"company-{index + 1}", company_verified=index not in {2, 4},
            company_violations=2 if index in {2, 4} else 0,
            category="Engineering" if index != 1 else "Design",
            location="Remote, United States", employment_type="Full-time",
            salary="$130k - $180k", skills=["React", "TypeScript", "Communication"],
            description=(
                "Build reliable products and collaborate with a cross-functional enterprise team."
            ),
            benefits=["Health coverage", "Learning budget", "Flexible leave"],
            posting_date=f"2026-07-{20 + index:02d}", status=statuses[index],
            report_count=[1, 0, 3, 5, 2, 0, 1][index], bookmarked=index in {0, 3},
            moderation_notes=[ModerationNote(
                id=f"note-{index + 1}", author="Alex Morgan",
                content="Initial policy review completed.",
                created_at="2026-08-01T10:00:00Z",
            )],
        )
        for index in range(len(statuses))
    ]


def _job_reports() -> list[JobReport]:
    return [
        JobReport(
            id="job-report-1", job_id="mod-job-4", job_title="Data Analyst",
            company="Lumina Health", reason="Potentially misleading compensation",
            reporter="candidate@example.com", report_date="2026-08-02",
            status="Investigating", resolution="Pending moderator review",
        ),
        JobReport(
            id="job-report-2", job_id="mod-job-3", job_title="Backend Engineer",
            company="Vertex Cloud", reason="Duplicate and expired listing",
            reporter="user@example.com", report_date="2026-08-01",
            status="Open", resolution="Not resolved",
        ),
        JobReport(
            id="job-report-3", job_id="mod-job-1",
            job_title="Senior Frontend Engineer", company="Northstar Labs",
            reason="Location details unclear", reporter="member@example.com",
            report_date="2026-07-30", status="Resolved",
            resolution="Company clarified remote eligibility",
        ),
    ]
