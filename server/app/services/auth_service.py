from app.models.user_model import UserCreate, UserOut
from app.cruds.user_crud import get_user_by_email, get_user_by_username, create_user, get_user_by_email_internal
from app.services.dependencies import hash_password, verify_password
from fastapi import HTTPException, status
from typing import Optional

async def signup(user_in: UserCreate) -> UserOut:
    existing_user = await get_user_by_email(user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    existing_user = await get_user_by_username(user_in.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this username already exists"
        )
    user_in.password = hash_password(user_in.password)
    return await create_user(user_in)

async def authenticate_user(email: str, password: str) -> Optional[UserOut]:
    # Use internal method to get user with password
    user_with_password = await get_user_by_email_internal(email)
    if not user_with_password:
        return None
    if not verify_password(password, user_with_password.password):
        return None
    
    # Return UserOut (without password) for security
    return UserOut(
        _id=user_with_password.id,
        username=user_with_password.username,
        email=user_with_password.email,
        role=user_with_password.role,
        profile=user_with_password.profile,
        rating=user_with_password.rating,
        created_at=user_with_password.created_at,
        updated_at=user_with_password.updated_at
    )
