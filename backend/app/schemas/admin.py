from pydantic import BaseModel


class AdminDashboardResponse(BaseModel):
    summary: dict[str, int | str]
    user_growth: list[dict[str, int | str]]
    job_growth: list[dict[str, int | str]]
    application_trend: list[dict[str, int | str]]
    top_companies: list[dict[str, int | str]]
    most_applied_jobs: list[dict[str, int | str]]
    active_users: list[dict[str, int | str]]


class AdminCollectionResponse(BaseModel):
    items: list[dict[str, object]]
    total: int


class AdminReportsResponse(BaseModel):
    reports: list[dict[str, object]]
    generated_at: str

