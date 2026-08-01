from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.database.session import get_db_session
from app.models.user import User
from app.schemas.user import UserPublic, UserUpdate
from app.services.auth_service import AuthService

router = APIRouter(prefix="/users")


@router.get("/me", response_model=UserPublic)
async def get_me(current_user: Annotated[User, Depends(get_current_user)]) -> UserPublic:
    return UserPublic.from_user(current_user)


@router.patch("/me", response_model=UserPublic)
async def update_me(
    payload: UserUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> UserPublic:
    return await AuthService(session).update_profile(current_user, payload)

