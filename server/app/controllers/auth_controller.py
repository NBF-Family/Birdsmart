from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from app.models.user_model import UserCreate, UserOut
from app.models.token_model import Token
from app.services.auth_service import signup as signup_service, authenticate_user
from app.services.dependencies import create_access_token, get_current_user
from app.core.config import ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=UserOut)
async def signup(user_in: UserCreate):
    """Register a new user"""
    return await signup_service(user_in)

@router.post("/login", response_model=UserOut)
async def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends()):
    """Login and set HttpOnly cookie with JWT"""
    # Authenticate user (using email as username in form)
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(subject=str(user.id))
    
    # Set HttpOnly cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # Convert minutes to seconds
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax",  # Helps prevent CSRF attacks
        path="/"  # Ensure cookie is available for all paths
    )
    
    return user

@router.post("/logout")
async def logout(response: Response):
    """Logout by clearing the HttpOnly cookie"""
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax"
    )
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserOut)
async def get_current_user_info(current_user: UserOut = Depends(get_current_user)):
    """Get current user information"""
    return current_user