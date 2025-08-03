from typing import List, Optional
from ..models.list_model import ListingCreate, ListingOut, ListingUpdate
from ..cruds.listing_crud import (
    create_listing,
    get_listing_by_id,
    get_all_listings,
    update_listing,
    delete_listing
)

async def create_listing_service(listing_data: ListingCreate) -> ListingOut:
    """Create a new listing"""
    if listing_data.price_usd < 0:
        raise ValueError("Price cannot be negative")
    
    # Call CRUD function
    return await create_listing(listing_data)

async def get_listing_service(listing_id: str) -> Optional[ListingOut]:
    """Get a listing by id"""
    return await get_listing_by_id(listing_id)

async def get_all_listings_service() -> List[ListingOut]:
    """Get all listings"""
    return await get_all_listings()

async def update_listing_service(listing_id: str, listing_data: ListingUpdate) -> Optional[ListingOut]:
    """Update a listing"""
    if listing_data.price_usd is not None and listing_data.price_usd < 0:
        raise ValueError("Price cannot be negative")
    
    return await update_listing(listing_id, listing_data)

async def delete_listing_service(listing_id: str) -> bool:
    """Delete a listing"""
    return await delete_listing(listing_id) 