from typing import Literal

from pydantic import BaseModel, Field

NotificationType = Literal[
    "application",
    "interview",
    "moderation",
    "recommendation",
    "message",
    "announcement",
    "system",
]
ActivityCategory = Literal["candidate", "company", "recruiter", "admin", "system"]


class NotificationItem(BaseModel):
    id: str
    owner_id: str
    type: NotificationType
    title: str
    description: str
    created_at: str
    is_read: bool = False
    action_url: str | None = None


class NotificationList(BaseModel):
    notifications: list[NotificationItem]
    total: int
    unread_count: int
    page: int = 1
    page_size: int = 10


class NotificationMutation(BaseModel):
    id: str | None = None
    status: Literal["read", "deleted", "cleared"]
    message: str


class ActivityItem(BaseModel):
    id: str
    title: str
    description: str
    occurred_at: str
    user: str
    category: ActivityCategory
    icon: str = Field(pattern=r"^[a-z-]+$")


class ActivityFeed(BaseModel):
    activities: list[ActivityItem]
    total: int
