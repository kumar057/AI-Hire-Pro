from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.auth.dependencies import get_current_user
from app.models.user import User, UserRole
from app.schemas.notifications import (
    ActivityFeed,
    ActivityItem,
    NotificationItem,
    NotificationList,
    NotificationMutation,
    NotificationType,
)

router = APIRouter()
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.get("/notifications")
async def get_notifications(
    current_user: CurrentUser,
    notification_type: Annotated[NotificationType | None, Query(alias="type")] = None,
    read: bool | None = None,
    search: str = "",
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=50)] = 10,
) -> NotificationList:
    items = _notifications(current_user)
    if notification_type:
        items = [item for item in items if item.type == notification_type]
    if read is not None:
        items = [item for item in items if item.is_read is read]
    if search:
        query = search.casefold()
        items = [item for item in items if query in f"{item.title} {item.description}".casefold()]
    total = len(items)
    start = (page - 1) * page_size
    return NotificationList(
        notifications=items[start : start + page_size],
        total=total,
        unread_count=sum(not item.is_read for item in _notifications(current_user)),
        page=page,
        page_size=page_size,
    )


@router.patch("/notifications/read-all")
async def mark_all_notifications_read(current_user: CurrentUser) -> NotificationMutation:
    return NotificationMutation(status="read", message="All notifications marked as read.")


@router.patch("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user: CurrentUser,
) -> NotificationMutation:
    _owned_notification(notification_id, current_user)
    return NotificationMutation(
        id=notification_id,
        status="read",
        message="Notification marked as read.",
    )


@router.delete("/notifications/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_user: CurrentUser,
) -> NotificationMutation:
    _owned_notification(notification_id, current_user)
    return NotificationMutation(
        id=notification_id,
        status="deleted",
        message="Notification deleted.",
    )


@router.delete("/notifications")
async def clear_notifications(current_user: CurrentUser) -> NotificationMutation:
    return NotificationMutation(status="cleared", message="All notifications cleared.")


@router.get("/activity-feed")
async def get_activity_feed(current_user: CurrentUser) -> ActivityFeed:
    activities = _activities(current_user)
    return ActivityFeed(activities=activities, total=len(activities))


def _owned_notification(notification_id: str, user: User) -> NotificationItem:
    notification = next(
        (item for item in _notifications(user) if item.id == notification_id),
        None,
    )
    if notification:
        return notification
    if notification_id.startswith("notification-"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access another user's notification",
        )
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")


def _notifications(user: User) -> list[NotificationItem]:
    role = user.role.value
    shared = [
        ("announcement", "Platform update", "New accessibility improvements are now available."),
        (
            "system",
            "Security check complete",
            "Your account security check completed successfully.",
        ),
    ]
    role_items = {
        UserRole.CANDIDATE: [
            (
                "application",
                "Application submitted",
                "Your Northstar Labs application was received.",
            ),
            (
                "application",
                "Application status changed",
                "Your application moved to Under Review.",
            ),
            ("interview", "Interview scheduled", "Interview scheduling details will appear here."),
            (
                "recommendation",
                "New job recommendations",
                "Eight roles match your profile and preferences.",
            ),
            ("message", "Message from a company", "A recruiter sent a placeholder message."),
        ],
        UserRole.COMPANY: [
            (
                "application",
                "New application received",
                "A candidate applied for Frontend Engineer.",
            ),
            ("moderation", "Job approved", "Frontend Engineer is now visible to candidates."),
            (
                "moderation",
                "Job rejected",
                "Data Analyst requires policy changes before publishing.",
            ),
            ("interview", "Interview reminder", "A candidate interview is scheduled tomorrow."),
        ],
        UserRole.ADMIN: [
            ("moderation", "Job awaiting approval", "Seven job postings require moderation."),
            ("announcement", "Admin announcement", "The weekly operations review is ready."),
            ("system", "System notification", "API health remains within target thresholds."),
        ],
    }[user.role]
    rows = [*role_items, *shared]
    return [
        NotificationItem(
            id=f"notification-{role}-{index + 1}",
            owner_id=user.uuid,
            type=item[0],
            title=item[1],
            description=item[2],
            created_at=f"2026-08-0{3 - index % 3}T{16 - index:02d}:00:00Z",
            is_read=index in {2, 5},
            action_url=_notification_url(user.role, item[0]),
        )
        for index, item in enumerate(rows)
    ]


def _notification_url(role: UserRole, item_type: str) -> str:
    root = f"/{role.value}/dashboard"
    if role == UserRole.ADMIN and item_type == "moderation":
        return f"{root}/jobs"
    if role == UserRole.COMPANY and item_type == "application":
        return f"{root}/applicants"
    if role == UserRole.CANDIDATE and item_type == "application":
        return f"{root}/application-history"
    return root


def _activities(user: User) -> list[ActivityItem]:
    role = user.role.value
    names = {
        UserRole.CANDIDATE: (
            "Ava Stone",
            "Updated candidate profile",
            "Profile completion reached 75%.",
        ),
        UserRole.COMPANY: (
            "Northstar Recruiter",
            "Moved candidate to screening",
            "Maya Chen advanced in the hiring pipeline.",
        ),
        UserRole.ADMIN: (
            "Morgan Admin",
            "Approved job posting",
            "Senior Frontend Engineer passed moderation.",
        ),
    }
    actor, title, description = names[user.role]
    rows = [
        (role, actor, title, description, "user"),
        (
            "system",
            "AIHire Pro",
            "System health check",
            "All core services are operational.",
            "activity",
        ),
        (
            "recruiter",
            "Recruiting Team",
            "Interview schedule updated",
            "Calendar placeholder was updated.",
            "calendar",
        ),
        (
            "admin",
            "Platform Admin",
            "Policy review completed",
            "Marketplace policy checks completed.",
            "shield",
        ),
    ]
    return [
        ActivityItem(
            id=f"activity-{role}-{index + 1}",
            category=row[0],
            user=row[1],
            title=row[2],
            description=row[3],
            icon=row[4],
            occurred_at=f"2026-08-03T{15 - index:02d}:30:00Z",
        )
        for index, row in enumerate(rows)
    ]
