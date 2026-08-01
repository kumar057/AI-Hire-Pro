from typing import Annotated

from fastapi import APIRouter, Depends

from app.auth.dependencies import require_roles
from app.models.user import User, UserRole

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
) -> dict[str, object]:
    return {
        "uuid": current_user.uuid,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "email": current_user.email,
        "headline": "Frontend Engineer",
        "location": "Remote",
        "profile_completion": 75,
        "skills": ["React", "TypeScript", "FastAPI", "Product Thinking"],
    }
