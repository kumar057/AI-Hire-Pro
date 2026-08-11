from __future__ import annotations

from abc import ABC, abstractmethod


class AIResumeParserProvider(ABC):
    """Abstract base class for AI resume parsing providers."""

    @abstractmethod
    async def parse(self, resume_text: str) -> dict[str, object]:
        """
        Parse resume text and return structured JSON.

        Args:
            resume_text: Extracted text from resume file

        Returns:
            Dictionary with parsed resume data

        Raises:
            ValueError: If parsing fails
        """
        pass


class MockAIResumeParser(AIResumeParserProvider):
    """Deterministic mock AI parser for testing/development."""

    async def parse(self, resume_text: str) -> dict[str, object]:
        """Parse resume using deterministic mock logic."""
        if not resume_text or len(resume_text.strip()) < 10:
            raise ValueError("Resume text is too short to parse")

        lines = resume_text.strip().split("\n")
        name = lines[0].strip() if lines else "Unknown"
        email = ""
        phone = ""

        for line in lines:
            if "@" in line and "." in line:
                email = line.strip()
                break

        for line in lines:
            if any(c.isdigit() for c in line) and ("-" in line or "(" in line):
                phone = line.strip()
                break

        years_exp = 3
        if "10+ years" in resume_text or "10 years" in resume_text:
            years_exp = 10
        elif "5+ years" in resume_text or "5 years" in resume_text:
            years_exp = 5
        elif "2+ years" in resume_text or "2 years" in resume_text:
            years_exp = 2

        skills = []
        if "Python" in resume_text:
            skills.append({"name": "Python", "category": "Programming"})
        if "JavaScript" in resume_text:
            skills.append({"name": "JavaScript", "category": "Programming"})
        if "React" in resume_text:
            skills.append({"name": "React", "category": "Technical"})
        if "FastAPI" in resume_text:
            skills.append({"name": "FastAPI", "category": "Technical"})
        if "SQL" in resume_text:
            skills.append({"name": "SQL", "category": "Technical"})
        if "Communication" in resume_text or "leadership" in resume_text.lower():
            skills.append({"name": "Communication", "category": "Soft"})

        if not skills:
            skills = [
                {"name": "Problem Solving", "category": "Soft"},
                {"name": "Team Collaboration", "category": "Soft"}
            ]

        return {
            "personal": {
                "name": name,
                "email": email or "contact@example.com",
                "phone": phone or "+1-555-0000",
                "location": "Location not specified"
            },
            "professional_summary": "Professional with diverse technical background.",
            "experience_years": years_exp,
            "skills": skills,
            "experience": [
                {
                    "company": "Previous Company",
                    "job_title": "Engineer",
                    "location": "",
                    "start_date": "2020-01",
                    "end_date": "",
                    "is_current": True,
                    "responsibilities": ["Contributed to projects"],
                    "technologies": []
                }
            ],
            "education": [
                {
                    "institution": "University",
                    "degree": "Bachelor",
                    "field_of_study": "Computer Science",
                    "start_date": "2016-09",
                    "end_date": "2020-05"
                }
            ],
            "projects": [],
            "certifications": [],
            "links": {
                "linkedin": "",
                "github": "",
                "portfolio": "",
                "other": []
            }
        }
