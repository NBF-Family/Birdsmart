from typing import List, Optional
from ..models.list_model import ListingCreate, ListingOut, ListingUpdate
from ..models.user_model import UserOut, Roles
from ..cruds.listing_crud import (
    create_listing,
    get_listing_by_id,
    get_all_listings,
    update_listing,
    delete_listing
)

def _is_admin(user: UserOut) -> bool:
    """Check if user has admin role"""
    return user.role == Roles.ADMIN

def _can_modify_listing(listing: ListingOut, user: UserOut) -> bool:
    """Check if user can modify the listing (owner or admin)"""
    return listing.seller_id == user.id or _is_admin(user)

async def create_listing_service(listing_data: ListingCreate, current_user: UserOut) -> ListingOut:
    """Create a new listing"""
    if listing_data.price_usd < 0:
        raise ValueError("Price cannot be negative")
    
    # Set the seller_id to the current user's ID
    listing_data.seller_id = current_user.id
    
    # Call CRUD function
    return await create_listing(listing_data)

async def get_listing_service(listing_id: str) -> Optional[ListingOut]:
    """Get a listing by id"""
    return await get_listing_by_id(listing_id)

async def get_all_listings_service() -> List[ListingOut]:
    """Get all listings"""
    return await get_all_listings()

async def get_user_listings_service(current_user: UserOut) -> List[ListingOut]:
    """Get all listings belonging to the current user"""
    all_listings = await get_all_listings()
    return [listing for listing in all_listings if listing.seller_id == current_user.id]

async def update_listing_service(listing_id: str, listing_data: ListingUpdate, current_user: UserOut) -> Optional[ListingOut]:
    """Update a listing"""
    if listing_data.price_usd is not None and listing_data.price_usd < 0:
        raise ValueError("Price cannot be negative")
    
    # First, get the listing to check ownership
    existing_listing = await get_listing_by_id(listing_id)
    if not existing_listing:
        return None
    
    # Check if the current user can modify this listing (owner or admin)
    if not _can_modify_listing(existing_listing, current_user):
        raise PermissionError("You can only update your own listings")
    
    return await update_listing(listing_id, listing_data)

async def delete_listing_service(listing_id: str, current_user: UserOut) -> bool:
    """Delete a listing"""
    # First, get the listing to check ownership
    existing_listing = await get_listing_by_id(listing_id)
    if not existing_listing:
        return False
    
    # Check if the current user can modify this listing (owner or admin)
    if not _can_modify_listing(existing_listing, current_user):
        raise PermissionError("You can only delete your own listings")
    
    return await delete_listing(listing_id) 