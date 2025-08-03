from app.models.user_model import UserCreate, UserOut, User, Roles, Profile, Location, Rating
from app.database.db import users_collection
from bson import ObjectId
from datetime import datetime, timezone

async def create_user(user_in: UserCreate) -> UserOut:
    # Create user document with all required fields
    user_doc = {
        "username": user_in.username,
        "email": user_in.email,
        "password": user_in.password,  # Already hashed in auth_service
        "role": Roles.BUYER,
        "profile": Profile(
            full_name=user_in.username,
            location=Location(coords=[0, 0], city="", country="", state=""),
            avatar_url=None,
        ).model_dump(),
        "rating": Rating(avg=0.0, count=0).model_dump(),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    
    # Insert and get the result
    result = await users_collection.insert_one(user_doc)
    
    # Get the inserted document
    inserted_user = await users_collection.find_one({"_id": result.inserted_id})
    
    # Convert ObjectId to string for Pydantic
    inserted_user["_id"] = str(inserted_user["_id"])
    
    return UserOut(**inserted_user)

async def get_user_by_id(user_id: str) -> UserOut:
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if user:
        user["_id"] = str(user["_id"])
        return UserOut(**user)
    return None

async def get_user_by_email(email: str) -> UserOut:
    user = await users_collection.find_one({"email": email})
    if user:
        user["_id"] = str(user["_id"])
        return UserOut(**user)
    return None

async def get_user_by_username(username: str) -> UserOut:
    user = await users_collection.find_one({"username": username})
    if user:
        user["_id"] = str(user["_id"])
        return UserOut(**user)
    return None

# Internal methods for authentication (return User with password)
async def get_user_by_email_internal(email: str) -> User:
    """Get user including password for authentication purposes"""
    user = await users_collection.find_one({"email": email})
    if user:
        user["_id"] = str(user["_id"])
        # Handle missing fields for old documents
        user.setdefault("role", Roles.BUYER)
        user.setdefault("profile", Profile(
            full_name=user.get("username", ""),
            location=Location(coords=[0, 0], city="", country="", state=""),
            avatar_url=None
        ).model_dump())
        user.setdefault("rating", Rating(avg=0.0, count=0).model_dump())
        user.setdefault("created_at", datetime.now(timezone.utc))
        user.setdefault("updated_at", datetime.now(timezone.utc))
        return User(**user)
    return None

async def get_user_by_username_internal(username: str) -> User:
    """Get user including password for authentication purposes"""
    user = await users_collection.find_one({"username": username})
    if user:
        user["_id"] = str(user["_id"])
        # Handle missing fields for old documents
        user.setdefault("role", Roles.BUYER)
        user.setdefault("profile", Profile(
            full_name=user.get("username", ""),
            location=Location(coords=[0, 0], city="", country="", state=""),
            avatar_url=None
        ).model_dump())
        user.setdefault("rating", Rating(avg=0.0, count=0).model_dump())
        user.setdefault("created_at", datetime.now(timezone.utc))
        user.setdefault("updated_at", datetime.now(timezone.utc))
        return User(**user)
    return None