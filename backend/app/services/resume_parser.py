from __future__ import annotations

import logging
from typing import TYPE_CHECKING

from pydantic import ValidationError

from app.schemas.resume_parser import ParsedResume
from app.services.ai_providers import AIResumeParserProvider, MockAIResumeParser
from app.services.text_extractor import ResumeTextExtractor, TextExtractionError

if TYPE_CHECKING:
    from fastapi import UploadFile

logger = logging.getLogger(__name__)


class ResumeParsingError(Exception):
    """Raised when resume parsing fails."""
    pass


class ResumeParser:
    """Main service for parsing resumes."""

    # Supported file extensions
    SUPPORTED_EXTENSIONS = {".pdf", ".docx"}
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

    def __init__(self, ai_provider: AIResumeParserProvider | None = None) -> None:
        """
        Initialize resume parser.

        Args:
            ai_provider: AI provider for parsing. Defaults to MockAIResumeParser if not provided.
        """
        self.ai_provider = ai_provider or MockAIResumeParser()
        self.extractor = ResumeTextExtractor()

    async def parse_uploaded_file(
        self,
        file: UploadFile,
    ) -> ParsedResume:
        """
        Parse an uploaded resume file.

        Args:
            file: FastAPI UploadFile object

        Returns:
            ParsedResume object with extracted data

        Raises:
            ResumeParsingError: If parsing fails
        """
        # Validate filename
        if not file.filename:
            raise ResumeParsingError("File must have a filename")

        # Validate file extension
        filename_lower = file.filename.lower()
        if not any(filename_lower.endswith(ext) for ext in self.SUPPORTED_EXTENSIONS):
            raise ResumeParsingError(
                f"Unsupported file type. Supported types: {', '.join(self.SUPPORTED_EXTENSIONS)}"
            )

        # Read file content
        try:
            file_content = await file.read()
        except Exception as e:
            raise ResumeParsingError(f"Failed to read file: {e}") from e

        # Validate file size
        if len(file_content) > self.MAX_FILE_SIZE:
            raise ResumeParsingError(
                f"File is too large. Maximum size is {self.MAX_FILE_SIZE // (1024 * 1024)} MB"
            )

        # Extract text
        try:
            resume_text = await self.extractor.extract_from_file(
                file_content, file.filename
            )
        except TextExtractionError as e:
            raise ResumeParsingError(f"Failed to extract text from file: {e}") from e

        # Parse with AI
        return await self.parse_text(resume_text)

    async def parse_text(self, resume_text: str) -> ParsedResume:
        """
        Parse resume text.

        Args:
            resume_text: Extracted text from resume

        Returns:
            ParsedResume object with extracted data

        Raises:
            ResumeParsingError: If parsing fails
        """
        if not resume_text or len(resume_text.strip()) < 10:
            raise ResumeParsingError("Resume text is too short to parse")

        try:
            # Get parsed data from AI provider
            parsed_data = await self.ai_provider.parse(resume_text)

            # Validate against schema
            parsed_resume = ParsedResume(**parsed_data)

            logger.info(
                f"Successfully parsed resume for {parsed_resume.personal.name or 'unknown'}"
            )

            return parsed_resume
        except ValidationError as e:
            logger.error(f"Resume parsing validation error: {e}")
            raise ResumeParsingError(
                f"Parsed resume data does not match expected schema: {e}"
            ) from e
        except Exception as e:
            logger.error(f"Resume parsing error: {e}")
            raise ResumeParsingError(f"Failed to parse resume: {e}") from e
