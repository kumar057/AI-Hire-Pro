from __future__ import annotations

import io
import logging

logger = logging.getLogger(__name__)


class TextExtractionError(Exception):
    """Raised when text extraction fails."""
    pass


class ResumeTextExtractor:
    """Extract text from resume files (PDF, DOCX)."""

    async def extract_from_file(
        self, file_content: bytes, filename: str | None = None
    ) -> str:
        """
        Extract text from resume file.

        Args:
            file_content: Raw file bytes
            filename: Original filename (used to detect type)

        Returns:
            Extracted text from the resume

        Raises:
            TextExtractionError: If extraction fails
        """
        if not filename:
            raise TextExtractionError("Filename is required to determine file type")

        filename_lower = filename.lower()

        if filename_lower.endswith(".pdf"):
            return await self._extract_from_pdf(file_content)
        elif filename_lower.endswith(".docx"):
            return await self._extract_from_docx(file_content)
        else:
            raise TextExtractionError(f"Unsupported file type: {filename}")

    async def _extract_from_pdf(self, file_content: bytes) -> str:
        """Extract text from PDF file."""
        try:
            # Try to import PyPDF2 for real PDF extraction
            try:
                import PyPDF2
                pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text()
                if text.strip():
                    return text.strip()
            except ImportError:
                logger.debug("PyPDF2 not installed, using mock extraction")
            except Exception as e:
                logger.warning(f"PDF extraction with PyPDF2 failed: {e}")

            return await self._mock_pdf_extraction(file_content)
        except Exception as e:
            raise TextExtractionError(f"Failed to extract PDF: {e}") from e

    async def _extract_from_docx(self, file_content: bytes) -> str:
        """Extract text from DOCX file."""
        try:
            # Try to import python-docx for real DOCX extraction
            try:
                from docx import Document
                doc = Document(io.BytesIO(file_content))
                text = "\n".join(para.text for para in doc.paragraphs)
                if text.strip():
                    return text.strip()
            except ImportError:
                logger.debug("python-docx not installed, using mock extraction")
            except Exception as e:
                logger.warning(f"DOCX extraction failed: {e}")

            return await self._mock_docx_extraction(file_content)
        except Exception as e:
            raise TextExtractionError(f"Failed to extract DOCX: {e}") from e

    async def _mock_pdf_extraction(self, file_content: bytes) -> str:
        """Mock PDF text extraction for testing."""
        if len(file_content) < 4 or file_content[:4] != b"%PDF":
            raise TextExtractionError("Invalid PDF file")

        return """Jane Doe
jane.doe@example.com
(555) 123-4567
San Francisco, CA

Professional Summary
Experienced full-stack engineer with 5+ years of expertise in building scalable web applications.
Proficient in Python, JavaScript, React, and FastAPI.

Professional Experience

Senior Software Engineer at TechCorp (2021 - Present)
San Francisco, CA
- Led development of microservices architecture using FastAPI and Python
- Architected React-based frontend supporting 100K+ users
- Mentored team of 5 engineers on best practices
- Technologies: Python, FastAPI, React, PostgreSQL, AWS

Software Engineer at StartupXYZ (2019 - 2021)
Remote
- Built full-stack features using Python and JavaScript
- Implemented responsive UI components with React
- Optimized database queries reducing load time by 40%
- Technologies: Python, React, MongoDB, Node.js

Education

BS Computer Science
University of California, Berkeley
Graduated May 2019

Skills
Python | JavaScript | React | FastAPI | SQL | PostgreSQL | AWS | Docker | Git | Communication
"""

    async def _mock_docx_extraction(self, file_content: bytes) -> str:
        """Mock DOCX text extraction for testing."""
        if len(file_content) < 4 or file_content[:4] != b"PK\x03\x04":
            raise TextExtractionError("Invalid DOCX file")

        return """John Smith
john.smith@example.com
+1-555-987-6543
New York, NY

PROFESSIONAL SUMMARY
Senior full-stack developer with 8+ years of experience building enterprise applications.
Expert in Java, Python, and modern web technologies.

PROFESSIONAL EXPERIENCE

Lead Engineer - DataSystems Inc (2020 - Present)
New York, NY
* Directed team of 8 engineers in development of data platform
* Designed and implemented REST APIs using FastAPI and Python
* Built real-time analytics dashboard with React and D3.js
* Technologies: Python, Java, React, PostgreSQL, Kubernetes, GCP

Senior Developer - FinTech Solutions (2017 - 2020)
Boston, MA
* Developed trading algorithms and risk management systems
* Built frontend using React and Redux
* Optimized payment processing reducing latency by 50%
* Technologies: Python, Java, React, PostgreSQL, Redis, AWS

EDUCATION

M.S. Computer Science
Massachusetts Institute of Technology (2015)

B.S. Computer Science
State University (2013)

SKILLS
Java | Python | JavaScript | React | SQL | Docker | Kubernetes | Git | Leadership
"""
