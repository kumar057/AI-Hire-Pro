import pytest
from fastapi.testclient import TestClient

from app.main import create_app
from app.services.ai_providers import MockAIResumeParser
from app.services.resume_parser import ResumeParser, ResumeParsingError
from app.services.text_extractor import ResumeTextExtractor, TextExtractionError


@pytest.fixture
def app():
    return create_app()


@pytest.fixture
def client(app):
    return TestClient(app)


class TestResumeParser:
    """Tests for the ResumeParser service."""

    @pytest.mark.asyncio
    async def test_parse_text_minimal_resume(self):
        """Test parsing minimal valid resume text."""
        parser = ResumeParser()
        resume_text = "John Doe\njohn@example.com\n(555) 123-4567\nSan Francisco, CA"

        result = await parser.parse_text(resume_text)

        assert result.personal.name == "John Doe"
        assert result.personal.email == "john@example.com"
        assert result.personal.phone == "(555) 123-4567"

    @pytest.mark.asyncio
    async def test_parse_text_empty_raises_error(self):
        """Test that empty text raises error."""
        parser = ResumeParser()

        with pytest.raises(ResumeParsingError, match="too short"):
            await parser.parse_text("")

    @pytest.mark.asyncio
    async def test_parse_text_whitespace_only_raises_error(self):
        """Test that whitespace-only text raises error."""
        parser = ResumeParser()

        with pytest.raises(ResumeParsingError, match="too short"):
            await parser.parse_text("   \n\n   ")

    @pytest.mark.asyncio
    async def test_parse_text_extracts_skills(self):
        """Test that skills are extracted from text."""
        parser = ResumeParser()
        resume_text = """
        Jane Doe
        jane@example.com
        Skills: Python, JavaScript, React, FastAPI
        """

        result = await parser.parse_text(resume_text)

        skill_names = [s.name for s in result.skills]
        assert "Python" in skill_names
        assert "React" in skill_names
        assert "FastAPI" in skill_names

    @pytest.mark.asyncio
    async def test_parse_text_detects_experience_years(self):
        """Test that experience years are detected."""
        parser = ResumeParser()
        resume_text = """
        Senior Engineer
        5+ years of experience in full-stack development
        """

        result = await parser.parse_text(resume_text)

        assert result.experience_years == 5


class TestTextExtractor:
    """Tests for the ResumeTextExtractor service."""

    @pytest.mark.asyncio
    async def test_extract_from_pdf_mock(self):
        """Test PDF extraction with mock data."""
        extractor = ResumeTextExtractor()

        pdf_bytes = b"%PDF-1.4\nJane Doe..."
        text = await extractor.extract_from_file(pdf_bytes, "resume.pdf")

        assert "Jane Doe" in text
        assert "@example.com" in text

    @pytest.mark.asyncio
    async def test_extract_from_docx_mock(self):
        """Test DOCX extraction with mock data."""
        extractor = ResumeTextExtractor()

        docx_bytes = b"PK\x03\x04John Smith..."
        text = await extractor.extract_from_file(docx_bytes, "resume.docx")

        assert "John Smith" in text
        assert "@example.com" in text

    @pytest.mark.asyncio
    async def test_extract_invalid_pdf_raises_error(self):
        """Test that invalid PDF raises error."""
        extractor = ResumeTextExtractor()

        invalid_pdf = b"This is not a PDF"

        with pytest.raises(TextExtractionError, match="Invalid PDF"):
            await extractor.extract_from_file(invalid_pdf, "resume.pdf")

    @pytest.mark.asyncio
    async def test_extract_invalid_docx_raises_error(self):
        """Test that invalid DOCX raises error."""
        extractor = ResumeTextExtractor()

        invalid_docx = b"This is not a DOCX"

        with pytest.raises(TextExtractionError, match="Invalid DOCX"):
            await extractor.extract_from_file(invalid_docx, "resume.docx")

    @pytest.mark.asyncio
    async def test_extract_unsupported_format_raises_error(self):
        """Test that unsupported format raises error."""
        extractor = ResumeTextExtractor()

        with pytest.raises(TextExtractionError, match="Unsupported file type"):
            await extractor.extract_from_file(b"content", "resume.txt")

    @pytest.mark.asyncio
    async def test_extract_without_filename_raises_error(self):
        """Test that extraction without filename raises error."""
        extractor = ResumeTextExtractor()

        with pytest.raises(TextExtractionError, match="Filename is required"):
            await extractor.extract_from_file(b"content", None)


class TestMockAIResumeParser:
    """Tests for the MockAIResumeParser provider."""

    @pytest.mark.asyncio
    async def test_parse_returns_valid_structure(self):
        """Test that parser returns valid resume structure."""
        parser = MockAIResumeParser()
        resume_text = "Jane Doe\njane@example.com\n5+ years experience\nPython React"

        result = await parser.parse(resume_text)

        assert "personal" in result
        assert "skills" in result
        assert "experience_years" in result
        assert result["experience_years"] == 5

    @pytest.mark.asyncio
    async def test_parse_detects_python_skill(self):
        """Test that Python skill is detected."""
        parser = MockAIResumeParser()
        resume_text = "Jane Doe\nSkills: Python, JavaScript"

        result = await parser.parse(resume_text)

        skills = result["skills"]
        skill_names = [s["name"] for s in skills]
        assert "Python" in skill_names

    @pytest.mark.asyncio
    async def test_parse_empty_text_raises_error(self):
        """Test that empty text raises error."""
        parser = MockAIResumeParser()

        with pytest.raises(ValueError, match="too short"):
            await parser.parse("")

    @pytest.mark.asyncio
    async def test_parse_minimal_text_raises_error(self):
        """Test that minimal text raises error."""
        parser = MockAIResumeParser()

        with pytest.raises(ValueError, match="too short"):
            await parser.parse("abc")


class TestResumeFileValidation:
    """Tests for file validation in ResumeParser."""

    @pytest.mark.asyncio
    async def test_supported_extensions(self):
        """Test that supported extensions are correct."""
        parser = ResumeParser()

        assert ".pdf" in parser.SUPPORTED_EXTENSIONS
        assert ".docx" in parser.SUPPORTED_EXTENSIONS

    def test_max_file_size_is_10mb(self):
        """Test that max file size is 10 MB."""
        parser = ResumeParser()

        assert parser.MAX_FILE_SIZE == 10 * 1024 * 1024

    @pytest.mark.asyncio
    async def test_parse_file_validates_extension(self):
        """Test that file extension is validated."""
        parser = ResumeParser()

        class MockFile:
            filename = "resume.txt"

            async def read(self):
                return b"content"

        with pytest.raises(ResumeParsingError, match="Unsupported file type"):
            await parser.parse_uploaded_file(MockFile())

    @pytest.mark.asyncio
    async def test_parse_file_validates_size(self):
        """Test that file size is validated."""
        parser = ResumeParser()

        class MockFile:
            filename = "resume.pdf"

            async def read(self):
                return b"x" * (11 * 1024 * 1024)  # 11 MB

        with pytest.raises(ResumeParsingError, match="too large"):
            await parser.parse_uploaded_file(MockFile())
