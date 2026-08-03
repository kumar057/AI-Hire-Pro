from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.dependencies import require_roles
from app.models.user import User, UserRole
from app.routers.applications import _applications
from app.schemas.applications import ApplicationTimelineEvent
from app.schemas.recruiter import (
    RecruiterCandidate,
    RecruiterCandidateList,
    RecruiterCandidateUpdate,
    RecruiterNote,
    RecruiterNotePayload,
    RecruiterRatingPayload,
    RecruiterStatusPayload,
)

router = APIRouter(prefix="/company/candidates")
RecruiterReader = Annotated[
    User, Depends(require_roles(UserRole.COMPANY, UserRole.ADMIN))
]
CompanyUser = Annotated[User, Depends(require_roles(UserRole.COMPANY))]


@router.get("")
async def list_recruiter_candidates(
    current_user: RecruiterReader,
) -> RecruiterCandidateList:
    candidates = _candidates()
    return RecruiterCandidateList(candidates=candidates, total=len(candidates))


@router.get("/{candidate_id}")
async def recruiter_candidate_detail(
    candidate_id: str, current_user: RecruiterReader
) -> RecruiterCandidate:
    candidate = next((item for item in _candidates() if item.id == candidate_id), None)
    if candidate is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    return candidate


@router.patch("/{candidate_id}/status")
async def update_recruiter_candidate_status(
    candidate_id: str, payload: RecruiterStatusPayload, current_user: CompanyUser
) -> RecruiterCandidateUpdate:
    candidate = await recruiter_candidate_detail(candidate_id, current_user)
    return RecruiterCandidateUpdate(
        candidate_id=candidate_id,
        message=f"Candidate moved to {payload.status}.",
        candidate=candidate.model_copy(update={"status": payload.status}),
    )


@router.post("/{candidate_id}/notes")
async def add_recruiter_note(
    candidate_id: str, payload: RecruiterNotePayload, current_user: CompanyUser
) -> RecruiterCandidateUpdate:
    candidate = await recruiter_candidate_detail(candidate_id, current_user)
    note = RecruiterNote(
        id=f"note-{candidate_id}-new",
        author="Current Recruiter",
        content=payload.content,
        created_at="2026-08-03T15:30:00+00:00",
    )
    return RecruiterCandidateUpdate(
        candidate_id=candidate_id,
        message="Internal note added.",
        candidate=candidate.model_copy(update={"notes": [*candidate.notes, note]}),
    )


@router.post("/{candidate_id}/rating")
async def rate_recruiter_candidate(
    candidate_id: str, payload: RecruiterRatingPayload, current_user: CompanyUser
) -> RecruiterCandidateUpdate:
    candidate = await recruiter_candidate_detail(candidate_id, current_user)
    return RecruiterCandidateUpdate(
        candidate_id=candidate_id,
        message=f"Candidate rated {payload.rating} stars.",
        candidate=candidate.model_copy(update={"rating": payload.rating}),
    )


def _candidates() -> list[RecruiterCandidate]:
    applications = _applications("candidate-placeholder")
    stages = [
        "Applied",
        "Screening",
        "Shortlisted",
        "Technical Interview",
        "HR Interview",
        "Final Review",
        "Offer",
        "Hired",
        "Rejected",
    ]
    names = [
        "Ava Stone",
        "Maya Chen",
        "Priya Kapoor",
        "Noah Williams",
        "Ethan Brooks",
        "Sofia Martinez",
        "Liam Walker",
        "Amara Okafor",
        "Lucas Silva",
    ]
    candidates = []
    for index, stage in enumerate(stages):
        application = applications[index % len(applications)]
        candidates.append(
            RecruiterCandidate(
                id=f"candidate-{index + 1}",
                application_id=application.id,
                name=names[index],
                email=f"candidate{index + 1}@example.com",
                phone=f"+1 415 555 01{40 + index}",
                location=["San Francisco, CA", "Austin, TX", "Remote, India"][index % 3],
                headline=application.job.title,
                experience=f"{3 + index % 6} years",
                education=["B.S. Computer Science - State University"],
                certifications=["AWS Cloud Practitioner", "Scrum Fundamentals"],
                skills=application.candidate.skills,
                portfolio_url="https://portfolio.example.com",
                github_url="https://github.com/aihire-candidate",
                linkedin_url="https://linkedin.com/in/aihire-candidate",
                job_id=application.job.id,
                job_title=application.job.title,
                status=stage,
                rating=1 + index % 5,
                tags=["High potential"] if index % 2 == 0 else ["Follow up"],
                bookmarked=index in {1, 5},
                resume_name=application.resume_name,
                cover_letter=application.cover_letter,
                applied_at=application.applied_at or "2026-07-20T10:00:00+00:00",
                notes=[
                    RecruiterNote(
                        id=f"note-{index + 1}",
                        author="Jordan Lee",
                        content="Strong communication and relevant product experience.",
                        created_at="2026-08-01T09:00:00+00:00",
                    )
                ],
                timeline=[
                    *application.timeline,
                    ApplicationTimelineEvent(
                        id=f"pipeline-{index + 1}",
                        status="Under Review",
                        title=f"Moved to {stage}",
                        description="Recruiter pipeline stage updated.",
                        occurred_at="2026-08-02T11:00:00+00:00",
                    ),
                ],
            )
        )
    return candidates
