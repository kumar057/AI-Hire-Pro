from app.models.user import UserRole

ROLE_PERMISSIONS: dict[UserRole, frozenset[str]] = {
    UserRole.CANDIDATE: frozenset(
        {
            "profile:read",
            "profile:update",
            "jobs:read",
            "applications:manage",
        }
    ),
    UserRole.COMPANY: frozenset(
        {
            "profile:read",
            "profile:update",
            "company:manage",
            "jobs:manage",
            "candidates:read",
        }
    ),
    UserRole.ADMIN: frozenset(
        {
            "profile:read",
            "profile:update",
            "users:manage",
            "companies:manage",
            "jobs:manage",
            "platform:admin",
        }
    ),
}


def get_permissions_for_role(role: UserRole) -> list[str]:
    return sorted(ROLE_PERMISSIONS[role])

