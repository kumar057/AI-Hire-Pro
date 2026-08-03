from typing import Annotated

from fastapi import APIRouter, Depends

from app.auth.dependencies import require_roles
from app.models.user import User, UserRole
from app.schemas.admin import (
    AdminCollectionResponse,
    AdminDashboardResponse,
    AdminReportsResponse,
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
async def get_admin_jobs(current_user: AdminUser) -> AdminCollectionResponse:
    items = [
        {
            "id": "job-1",
            "title": "Senior Frontend Engineer",
            "company": "Northstar Labs",
            "applications": 142,
            "status": "Active",
            "posted": "Jul 18, 2026",
        },
        {
            "id": "job-2",
            "title": "Product Designer",
            "company": "SignalWorks",
            "applications": 98,
            "status": "Active",
            "posted": "Jul 22, 2026",
        },
        {
            "id": "job-3",
            "title": "Backend Engineer",
            "company": "Vertex Cloud",
            "applications": 121,
            "status": "Review",
            "posted": "Aug 1, 2026",
        },
        {
            "id": "job-4",
            "title": "Data Analyst",
            "company": "Lumina Health",
            "applications": 74,
            "status": "Closed",
            "posted": "Jun 30, 2026",
        },
        {
            "id": "job-5",
            "title": "Platform Engineer",
            "company": "Northstar Labs",
            "applications": 88,
            "status": "Active",
            "posted": "Jul 25, 2026",
        },
    ]
    return AdminCollectionResponse(items=items, total=len(items))


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
