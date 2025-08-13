from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status, Request
from jose import JWTError, jwt
from ..core.config import SECRET_KEY, ALGORITHM
from ..models.token_model import TokenData
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from ..core.config import ACCESS_TOKEN_EXPIRE_MINUTES
from ..cruds.user_crud import get_user_by_id

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def hash_password(password: str) -> str:
    return pwd_ctx.hash(password)

def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_ctx.verify(password, hashed_password)

def create_access_token(subject: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(request: Request):
    """Get current user from HttpOnly cookie"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Get token from cookie
    token = request.cookies.get("access_token")
    if not token:
        raise credentials_exception

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(id=user_id)
    except JWTError:
        raise credentials_exception

    user = await get_user_by_id(token_data.id)
    if user is None:
        raise credentials_exception
    return user