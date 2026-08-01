from typing import Annotated

from fastapi import APIRouter, Depends

from app.auth.dependencies import require_roles
from app.models.user import User, UserRole
from app.schemas.candidate import CandidateProfilePayload, CandidateProfileResponse

router = APIRouter(prefix="/candidate")


@router.get("/dashboard")
async def get_candidate_dashboard(
    current_user: Annotated[User, Depends(require_roles(UserRole.CANDIDATE))],
) -> dict[str, object]:
    return {
        "user_id": current_user.uuid,
        "summary": {
            "jobs_applied": 18,
            "saved_jobs": 42,
            "resume_score": 86,
            "profile_completion": 75,
            "job_matches": 128,
            "interviews": 4,
        },
        "recent_activity": [
            {
                "id": "activity-1",
                "title": "Profile strength updated",
                "description": "Your profile completion moved to 75%.",
                "occurred_at": "2026-08-01T09:30:00Z",
            },
            {
                "id": "activity-2",
                "title": "New AI job matches",
                "description": "12 new roles match your preferred skills.",
                "occurred_at": "2026-08-01T08:10:00Z",
            },
        ],
    }


@router.get("/profile")
async def get_candidate_profile(
    current_user: Annotated[User, Depends(require_roles(UserRole.CANDIDATE))],
) -> CandidateProfileResponse:
    return _candidate_profile_payload(current_user)


@router.put("/profile")
async def update_candidate_profile(
    payload: CandidateProfilePayload,
    current_user: Annotated[User, Depends(require_roles(UserRole.CANDIDATE))],
) -> CandidateProfileResponse:
    return CandidateProfileResponse(uuid=current_user.uuid, **payload.model_dump())


def _candidate_profile_payload(user: User) -> CandidateProfileResponse:
    return CandidateProfileResponse(
        uuid=user.uuid,
        first_name=user.first_name,
        last_name=user.last_name,
        headline="Frontend Engineer",
        avatar_url=None,
        email=user.email,
        phone=user.phone,
        address_line="221B Market Street",
        city="San Francisco",
        state="California",
        country="United States",
        postal_code="94105",
        date_of_birth="1995-04-12",
        gender="Prefer not to say",
        bio=(
            "Product-minded frontend engineer focused on accessible, polished, "
            "high-performance SaaS experiences."
        ),
        skills=["React", "TypeScript", "FastAPI", "Product Thinking"],
        education=["B.S. Computer Science - State University"],
        work_experience=["Frontend Engineer - SignalWorks"],
        certifications=["AWS Cloud Practitioner"],
        languages=["English", "Hindi"],
        portfolio_url="https://portfolio.example.com",
        github_url="https://github.com/aihire-candidate",
        linkedin_url="https://www.linkedin.com/in/aihire-candidate",
        website_url="https://candidate.example.com",
        profile_completion=75,
    )
