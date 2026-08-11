from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.dependencies import get_current_user, require_roles
from app.models.user import User, UserRole
from app.routers.jobs import _jobs
from app.schemas.applications import (
    ApplicationCandidate,
    ApplicationDeleteResponse,
    ApplicationListResponse,
    ApplicationStatusUpdate,
    ApplicationTimelineEvent,
    JobApplication,
    JobApplicationCreate,
)

router = APIRouter()
CandidateUser = Annotated[User, Depends(require_roles(UserRole.CANDIDATE))]
CompanyUser = Annotated[User, Depends(require_roles(UserRole.COMPANY))]
AuthenticatedUser = Annotated[User, Depends(get_current_user)]


@router.post("/applications", status_code=status.HTTP_201_CREATED)
async def create_application(
    payload: JobApplicationCreate, current_user: CandidateUser
) -> JobApplication:
    job = next((item for item in _jobs() if item.id == payload.job_id), _jobs()[0])
    application = _application_for(current_user.uuid, 0, job.id)
    timeline = []
    applied_at = None
    if payload.status == "Submitted":
        applied_at = "2026-08-03T12:00:00+00:00"
        timeline = [
            _event(
                "created-submitted",
                "Submitted",
                "Application submitted",
                "Your application was delivered to the hiring team.",
                applied_at,
            )
        ]
    return application.model_copy(
        update={
            "id": "application-new",
            "job": job,
            "resume_id": payload.resume_id,
            "resume_name": "Ava-Stone-Resume.pdf",
            "cover_letter": payload.cover_letter,
            "status": payload.status,
            "applied_at": applied_at,
            "updated_at": "2026-08-03T12:00:00+00:00",
            "timeline": timeline,
        }
    )


@router.get("/candidate/applications")
async def candidate_applications(current_user: CandidateUser) -> ApplicationListResponse:
    applications = _applications(current_user.uuid)
    return ApplicationListResponse(applications=applications, total=len(applications))


@router.get("/company/applications")
async def company_applications(current_user: CompanyUser) -> ApplicationListResponse:
    applications = _applications("candidate-placeholder")
    return ApplicationListResponse(applications=applications, total=len(applications))


@router.get("/applications/{application_id}")
async def application_detail(
    application_id: str, current_user: AuthenticatedUser
) -> JobApplication:
    applications = _applications(
        current_user.uuid if current_user.role == UserRole.CANDIDATE else "candidate-placeholder"
    )
    application = next((item for item in applications if item.id == application_id), None)
    if application is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    return application


@router.patch("/applications/{application_id}/status")
async def update_application_status(
    application_id: str, payload: ApplicationStatusUpdate, current_user: CompanyUser
) -> JobApplication:
    application = await application_detail(application_id, current_user)
    event = _event(
        f"{application_id}-status-update",
        payload.status,
        payload.status,
        payload.note or f"Application moved to {payload.status} by the hiring team.",
        "2026-08-03T14:30:00+00:00",
    )
    return application.model_copy(
        update={
            "status": payload.status,
            "updated_at": event.occurred_at,
            "timeline": [*application.timeline, event],
        }
    )


@router.delete("/applications/{application_id}")
async def withdraw_application(
    application_id: str, current_user: CandidateUser
) -> ApplicationDeleteResponse:
    await application_detail(application_id, current_user)
    return ApplicationDeleteResponse(
        id=application_id,
        status="Withdrawn",
        message="Application withdrawn successfully.",
    )


def _applications(candidate_id: str) -> list[JobApplication]:
    return [
        _application_for(candidate_id, 0, "job-001"),
        _application_for(candidate_id, 1, "job-002"),
        _application_for(candidate_id, 2, "job-004"),
        _application_for(candidate_id, 3, "job-005"),
    ]


def _application_for(candidate_id: str, index: int, job_id: str) -> JobApplication:
    job = next(item for item in _jobs() if item.id == job_id)
    statuses = ["Interview Scheduled", "Under Review", "Shortlisted", "Draft"]
    current_status = statuses[index]
    submitted_at = f"2026-07-{18 + index:02d}T10:00:00+00:00"
    timeline = [] if current_status == "Draft" else [
        _event(
            f"application-{index + 1}-submitted",
            "Submitted",
            "Application submitted",
            f"Application for {job.title} was delivered.",
            submitted_at,
        ),
        _event(
            f"application-{index + 1}-review",
            "Under Review",
            "Hiring team review",
            "The company reviewed the candidate profile and resume.",
            f"2026-07-{20 + index:02d}T11:30:00+00:00",
        ),
    ]
    if current_status in {"Shortlisted", "Interview Scheduled"}:
        timeline.append(
            _event(
                f"application-{index + 1}-shortlisted",
                "Shortlisted",
                "Candidate shortlisted",
                "The candidate advanced to the interview stage.",
                f"2026-07-{23 + index:02d}T09:15:00+00:00",
            )
        )
    if current_status == "Interview Scheduled":
        timeline.append(
            _event(
                f"application-{index + 1}-interview",
                "Interview Scheduled",
                "Interview scheduled",
                "Technical interview scheduled for August 6 at 10:00 AM.",
                "2026-08-02T16:00:00+00:00",
            )
        )
    return JobApplication(
        id=f"application-{index + 1}",
        candidate_id=candidate_id,
        company_id="northstar-company",
        job=job,
        candidate=ApplicationCandidate(
            id=candidate_id,
            name="Ava Stone",
            email="candidate@example.com",
            phone="+1 415 555 0148",
            location="San Francisco, CA",
            headline="Senior Frontend Engineer",
            experience="6 years",
            skills=["React", "TypeScript", "Design Systems", "FastAPI"],
            match_score=94 - index * 3,
        ),
        resume_id="resume-current",
        resume_name="Ava-Stone-Resume.pdf",
        cover_letter=(
            "I am excited to bring product-minded engineering, accessible frontend systems, "
            "and strong cross-functional collaboration to this role."
        ),
        status=current_status,
        applied_at=None if current_status == "Draft" else submitted_at,
        updated_at=timeline[-1].occurred_at if timeline else submitted_at,
        timeline=timeline,
    )


def _event(
    event_id: str,
    event_status: str,
    title: str,
    description: str,
    occurred_at: str,
) -> ApplicationTimelineEvent:
    return ApplicationTimelineEvent(
        id=event_id,
        status=event_status,
        title=title,
        description=description,
        occurred_at=occurred_at,
    )
