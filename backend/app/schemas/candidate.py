from pydantic import BaseModel, ConfigDict, EmailStr, Field, HttpUrl


class CandidateProfilePayload(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    headline: str = Field(min_length=2, max_length=140)
    avatar_url: HttpUrl | None = None
    email: EmailStr
    phone: str | None = Field(default=None, max_length=32)
    address_line: str | None = Field(default=None, max_length=180)
    city: str | None = Field(default=None, max_length=100)
    state: str | None = Field(default=None, max_length=100)
    country: str | None = Field(default=None, max_length=100)
    postal_code: str | None = Field(default=None, max_length=32)
    date_of_birth: str | None = Field(default=None, max_length=20)
    gender: str | None = Field(default=None, max_length=40)
    bio: str | None = Field(default=None, max_length=800)
    skills: list[str] = Field(default_factory=list, max_length=30)
    education: list[str] = Field(default_factory=list, max_length=20)
    work_experience: list[str] = Field(default_factory=list, max_length=20)
    certifications: list[str] = Field(default_factory=list, max_length=20)
    languages: list[str] = Field(default_factory=list, max_length=20)
    portfolio_url: HttpUrl | None = None
    github_url: HttpUrl | None = None
    linkedin_url: HttpUrl | None = None
    website_url: HttpUrl | None = None
    profile_completion: int = Field(default=75, ge=0, le=100)


class CandidateProfileResponse(CandidateProfilePayload):
    uuid: str
