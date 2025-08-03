from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from pymongo.collection import Collection
from pymongo.database import Database

from ..models.list_model import ListingCreate, ListingOut, ListingUpdate
from ..database.db import client

class ListingService:
    def __init__(self):
        self.db: Database = client["Birdsmart"]
        self.collection: Collection = self.db["Listing"]
    
    async def create_listing(self, listing_data: ListingCreate) -> ListingOut:
        """Create a new listing"""
        listing_dict = listing_data.model_dump(by_alias=True)
        listing_dict["created_at"] = datetime.utcnow()
        listing_dict["updated_at"] = datetime.utcnow()
        
        result = self.collection.insert_one(listing_dict)
        listing_dict["_id"] = str(result.inserted_id)
        
        return ListingOut(**listing_dict)
    
    async def get_listing(self, listing_id: str) -> Optional[ListingOut]:
        """Get a listing by ID"""
        try:
            listing = self.collection.find_one({"_id": ObjectId(listing_id)})
            if listing:
                listing["_id"] = str(listing["_id"])
                return ListingOut(**listing)
            return None
        except Exception:
            return None
    
    async def get_all_listings(self) -> List[ListingOut]:
        """Get all listings"""
        listings = []
        cursor = self.collection.find()
        for listing in cursor:
            listing["_id"] = str(listing["_id"])
            listings.append(ListingOut(**listing))
        return listings
    
    async def update_listing(self, listing_id: str, listing_data: ListingUpdate) -> Optional[ListingOut]:
        """Update a listing"""
        try:
            update_data = listing_data.model_dump(exclude_unset=True, by_alias=True)
            if update_data:
                update_data["updated_at"] = datetime.utcnow()
                
                result = self.collection.update_one(
                    {"_id": ObjectId(listing_id)},
                    {"$set": update_data}
                )
                
                if result.modified_count > 0:
                    return await self.get_listing(listing_id)
            return None
        except Exception:
            return None
    
    async def delete_listing(self, listing_id: str) -> bool:
        """Delete a listing"""
        try:
            result = self.collection.delete_one({"_id": ObjectId(listing_id)})
            return result.deleted_count > 0
        except Exception:
            return False 