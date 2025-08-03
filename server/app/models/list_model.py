from pydantic import BaseModel, Field, Optional
from enum import Enum
from datetime import datetime

class Sex(str, Enum):
    MALE = "male"
    FEMALE = "female"
    UNKNOWN = "unknown"

class Production(str, Enum):
    SELF_PRODUCED = "self_produced"
    PURCHASED = "purchased"
    RESCUED = "rescued"
    OTHER = "other"

class Location(BaseModel):
    coords: list[float]
    city: str
    country: str
    state: str

class HealthInfo(BaseModel):
    vet_checked: bool = Field(alias="vetChecked")
    notes: Optional[str] = None

    class Config:
        allow_population_by_field_name = True

class Status(str, Enum):
    ACTIVE = "active"
    SOLD = "sold"
    PENDING = "pending"
    INACTIVE = "inactive"

class ListingBase(BaseModel):
    seller_id: str = Field(alias="sellerId")
    title: str = Field(..., min_length=1, max_length=200)
    traits: list[str] = []
    sex: Sex
    production: Production
    birth: int = Field(..., ge=1900, le=2030, description="Birth year")
    description: str = Field(..., min_length=1)
    species: str = Field(..., min_length=1)
    price_usd: float = Field(alias="priceUSD", ge=0)
    photos: list[str] = []
    health_info: HealthInfo = Field(alias="healthInfo")
    location: Location
    status: Status = Status.ACTIVE

class ListingCreate(ListingBase):
    pass

class ListingOut(ListingBase):
    id: str = Field(..., alias="_id")
    created_at: datetime
    updated_at: datetime

    class Config:
        allow_population_by_field_name = True
        json_encoders = {datetime: lambda dt: dt.isoformat()}

class ListingUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    traits: Optional[list[str]] = None
    sex: Optional[Sex] = None
    production: Optional[Production] = None
    birth: Optional[int] = Field(None, ge=1900, le=2030)
    description: Optional[str] = Field(None, min_length=1)
    species: Optional[str] = Field(None, min_length=1)
    price_usd: Optional[float] = Field(None, alias="priceUSD", ge=0)
    photos: Optional[list[str]] = None
    health_info: Optional[HealthInfo] = Field(None, alias="healthInfo")
    location: Optional[Location] = None
    status: Optional[Status] = None

    class Config:
        allow_population_by_field_name = True
