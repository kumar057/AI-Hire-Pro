from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.auth.dependencies import require_roles
from app.models.user import User, UserRole
from app.schemas.resume_parser import ResumeParseResponse
from app.services.resume_parser import ResumeParser, ResumeParsingError

router = APIRouter(prefix="/resume")


@router.post("/parse", status_code=status.HTTP_200_OK)
async def parse_resume(
    file: Annotated[UploadFile, File(description="PDF or DOCX resume file")],
    current_user: Annotated[User, Depends(require_roles(UserRole.CANDIDATE))],
) -> ResumeParseResponse:
    """
    Parse a resume file and extract structured data.

    Only candidates can use this endpoint.

    Args:
        file: Resume file (PDF or DOCX)
        current_user: Authenticated candidate user

    Returns:
        Parsed resume data with structured information

    Raises:
        400: Invalid file format, file too large, or parsing failed
        401: Not authenticated
        403: User is not a candidate
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must have a filename",
        )

    parser = ResumeParser()

    try:
        parsed_resume = await parser.parse_uploaded_file(file)

        return ResumeParseResponse(
            parsed_resume=parsed_resume,
            extraction_confidence=0.85,
            extraction_notes=[
                "This is an automated parse. Please review for accuracy.",
                "Personal contact information was extracted from the resume.",
                "Some fields may require manual verification.",
            ],
        )
    except ResumeParsingError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while parsing the resume",
        ) from e
