from datetime import UTC, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.auth.dependencies import require_roles
from app.models.user import User, UserRole
from app.routers.jobs import _jobs
from app.schemas.candidate import (
    CandidateProfilePayload,
    CandidateProfileResponse,
    CandidateResumeFile,
    CandidateResumeHistoryItem,
    CandidateResumeResponse,
)
from app.schemas.jobs import (
    ApplicationTimelineItem,
    CandidateApplication,
    CandidateAppliedJobsResponse,
    CandidateJobActionPayload,
    CandidateJobActionResponse,
    JobListResponse,
    JobPosting,
)

router = APIRouter(prefix="/candidate")

SUPPORTED_RESUME_EXTENSIONS = {".pdf": "PDF", ".docx": "DOCX"}


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


@router.get("/resume")
async def get_candidate_resume(
    current_user: Annotated[User, Depends(require_roles(UserRole.CANDIDATE))],
) -> CandidateResumeResponse:
    return _candidate_resume_payload(current_user)


@router.post("/resume", status_code=status.HTTP_201_CREATED)
async def upload_candidate_resume(
    file: Annotated[UploadFile, File(description="PDF or DOCX resume")],
    current_user: Annotated[User, Depends(require_roles(UserRole.CANDIDATE))],
) -> CandidateResumeResponse:
    file_extension = _resume_extension(file.filename)
    if file_extension not in SUPPORTED_RESUME_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF and DOCX resumes are supported",
        )

    content = await file.read()
    uploaded_at = datetime.now(UTC).isoformat()
    return CandidateResumeResponse(
        current_resume=CandidateResumeFile(
            id=f"resume-{current_user.uuid}",
            file_name=file.filename or f"candidate-resume{file_extension}",
            file_type=SUPPORTED_RESUME_EXTENSIONS[file_extension],
            file_size=len(content),
            upload_date=uploaded_at,
            status="uploaded",
            preview_url=None,
            download_url=None,
        ),
        history=[
            CandidateResumeHistoryItem(
                id="history-current-upload",
                file_name=file.filename or f"candidate-resume{file_extension}",
                file_size=len(content),
                upload_date=uploaded_at,
                action="Uploaded",
            ),
            *_candidate_resume_history(),
        ],
    )


@router.delete("/resume")
async def delete_candidate_resume(
    current_user: Annotated[User, Depends(require_roles(UserRole.CANDIDATE))],
) -> CandidateResumeResponse:
    return CandidateResumeResponse(current_resume=None, history=_candidate_resume_history())


@router.get("/saved-jobs")
async def get_saved_jobs(
    current_user: Annotated[User, Depends(require_roles(UserRole.CANDIDATE))],
) -> JobListResponse:
    saved_jobs = [job for job in _jobs() if job.is_saved]
    return JobListResponse(
        jobs=saved_jobs,
        total=len(saved_jobs),
        page=1,
        page_size=len(saved_jobs),
    )


@router.get("/applied-jobs")
async def get_applied_jobs(
    current_user: Annotated[User, Depends(require_roles(UserRole.CANDIDATE))],
) -> CandidateAppliedJobsResponse:
    applications = _candidate_applications()
    return CandidateAppliedJobsResponse(
        applications=applications,
        total=len(applications),
        status_counts={"Applied": 1, "Interview": 1, "Review": 1},
        chart=[
            {"label": "Apr", "applications": 2},
            {"label": "May", "applications": 4},
            {"label": "Jun", "applications": 6},
            {"label": "Jul", "applications": 5},
            {"label": "Aug", "applications": 3},
        ],
    )


@router.post("/save-job")
async def save_candidate_job(
    payload: CandidateJobActionPayload,
    current_user: Annotated[User, Depends(require_roles(UserRole.CANDIDATE))],
) -> CandidateJobActionResponse:
    return CandidateJobActionResponse(
        job_id=payload.job_id,
        status="saved",
        message="Job saved to candidate workspace.",
    )


@router.post("/apply-job")
async def apply_candidate_job(
    payload: CandidateJobActionPayload,
    current_user: Annotated[User, Depends(require_roles(UserRole.CANDIDATE))],
) -> CandidateJobActionResponse:
    return CandidateJobActionResponse(
        job_id=payload.job_id,
        status="applied",
        message="Application placeholder submitted.",
    )


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


def _candidate_resume_payload(user: User) -> CandidateResumeResponse:
    return CandidateResumeResponse(
        current_resume=CandidateResumeFile(
            id=f"resume-{user.uuid}",
            file_name="Ava-Stone-Resume.pdf",
            file_type="PDF",
            file_size=238_400,
            upload_date="2026-08-01T10:00:00+00:00",
            status="ready",
            preview_url=None,
            download_url=None,
        ),
        history=_candidate_resume_history(),
    )


def _candidate_resume_history() -> list[CandidateResumeHistoryItem]:
    return [
        CandidateResumeHistoryItem(
            id="history-1",
            file_name="Ava-Stone-Resume.pdf",
            file_size=238_400,
            upload_date="2026-08-01T10:00:00+00:00",
            action="Uploaded",
        ),
        CandidateResumeHistoryItem(
            id="history-2",
            file_name="Ava-Stone-Resume-v2.docx",
            file_size=184_220,
            upload_date="2026-07-24T15:45:00+00:00",
            action="Replaced",
        ),
        CandidateResumeHistoryItem(
            id="history-3",
            file_name="Ava-Stone-Resume-v1.pdf",
            file_size=201_780,
            upload_date="2026-07-10T08:15:00+00:00",
            action="Uploaded",
        ),
    ]


def _resume_extension(filename: str | None) -> str:
    if not filename or "." not in filename:
        return ""

    return f".{filename.rsplit('.', maxsplit=1)[-1].lower()}"


def _candidate_applications() -> list[CandidateApplication]:
    applied_jobs = [job for job in _jobs() if job.is_applied]
    review_job = JobPosting(
        id="job-009",
        title="React Dashboard Engineer",
        company="MetricLoop",
        location="Remote, United States",
        work_mode="Remote",
        employment_type="Full-time",
        salary_range="$130k - $165k",
        match_score=86,
        posted_at="2026-07-18",
        experience_level="Mid-Senior",
        skills=["React", "Charts", "TypeScript", "Accessibility"],
        is_saved=True,
        is_applied=True,
        description="Build analytical dashboards for candidate and recruiter workflows.",
    )
    jobs = [*applied_jobs, review_job]
    statuses = ["Interview", "Applied", "Review"]
    return [
        CandidateApplication(
            id=f"application-{index + 1}",
            job=job,
            status=statuses[index],
            applied_at=f"2026-0{6 + index}-1{index}T10:00:00+00:00",
            updated_at=f"2026-08-0{index + 1}T09:00:00+00:00",
            timeline=[
                ApplicationTimelineItem(
                    id=f"application-{index + 1}-submitted",
                    label="Application Submitted",
                    description=f"Your application for {job.title} was received.",
                    occurred_at=f"2026-0{6 + index}-1{index}T10:00:00+00:00",
                    status="complete",
                ),
                ApplicationTimelineItem(
                    id=f"application-{index + 1}-review",
                    label="Recruiter Review",
                    description="The hiring team is reviewing your profile and resume.",
                    occurred_at=f"2026-0{6 + index}-1{index + 1}T13:30:00+00:00",
                    status="active" if statuses[index] != "Applied" else "pending",
                ),
                ApplicationTimelineItem(
                    id=f"application-{index + 1}-interview",
                    label="Interview",
                    description="Interview scheduling placeholder.",
                    occurred_at=f"2026-08-0{index + 4}T16:00:00+00:00",
                    status="active" if statuses[index] == "Interview" else "pending",
                ),
            ],
        )
        for index, job in enumerate(jobs)
    ]
