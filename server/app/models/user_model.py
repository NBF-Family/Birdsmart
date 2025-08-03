from pydantic import BaseModel, Field, Optional
from enum import Enum
from datetime import datetime

class Location(BaseModel):
    coords: list[float]
    city: str
    country: str
    state: str
    
class Rating(BaseModel):
    avg: float = Field(..., ge=0, le=5)
    count: int = 0

class Profile(BaseModel):
    full_name: str
    location: Location
    avatar_url: Optional[str] = None

class Roles(str, Enum):
    BUYER = "buyer"
    SELLER = "seller"

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters long")

class UserOut(UserBase):
    id: str = Field(..., alias="_id")
    role: Roles
    profile: Profile
    rating: Rating
    created_at: datetime
    updated_at: datetime

    class Config:
        allow_population_by_field_name = True
        json_encoders = {datetime: lambda dt: dt.isoformat()}

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    profile: Optional[Profile] = None
    rating: Optional[Rating] = None
    role: Optional[Roles] = None

    class Config:
        allow_population_by_field_name = True

class PasswordUpdate(BaseModel):
    current_password: str = Field(..., min_length=8, description="Password must be at least 8 characters long")
    new_password: str = Field(..., min_length=8, description="Password must be at least 8 characters long")
