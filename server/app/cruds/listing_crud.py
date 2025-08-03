from typing import List, Optional
from bson import ObjectId
from datetime import datetime, timezone
from ..models.list_model import ListingCreate, ListingOut, ListingUpdate
from app.database.db import lists_collection as collection

async def create_listing(listing_data: ListingCreate) -> ListingOut:
    """Create a new listing in database"""
    listing_dict = listing_data.model_dump(by_alias=True)
    listing_dict["created_at"] = datetime.now(timezone.utc)
    listing_dict["updated_at"] = datetime.now(timezone.utc)
    
    result = await collection.insert_one(listing_dict)
    listing_dict["_id"] = str(result.inserted_id)
    
    return ListingOut(**listing_dict)

async def get_listing_by_id(listing_id: str) -> Optional[ListingOut]:
    """Get a listing by ID from database"""
    listing = await collection.find_one({"_id": ObjectId(listing_id)})
    if listing:
        listing["_id"] = str(listing["_id"])
        return ListingOut(**listing)
    return None

async def get_all_listings() -> List[ListingOut]:
    """Get all listings from database"""
    listings = []
    cursor = collection.find()
    async for listing in cursor:
        listing["_id"] = str(listing["_id"])
        listings.append(ListingOut(**listing))
    return listings

async def update_listing(listing_id: str, listing_data: ListingUpdate) -> Optional[ListingOut]:
    """Update a listing in database"""
    update_data = listing_data.model_dump(exclude_unset=True, by_alias=True)
    if update_data:
        update_data["updated_at"] = datetime.now(timezone.utc)
        
        result = await collection.update_one(
            {"_id": ObjectId(listing_id)},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            return await get_listing_by_id(listing_id)
    return None

async def delete_listing(listing_id: str) -> bool:
    """Delete a listing from database"""
    result = await collection.delete_one({"_id": ObjectId(listing_id)})
    return result.deleted_count > 0