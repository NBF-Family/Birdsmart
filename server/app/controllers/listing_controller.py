from typing import List
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse

from ..models.list_model import ListingCreate, ListingOut, ListingUpdate
from ..services.listing_service import ListingService

listing_router = APIRouter(prefix="/listings", tags=["listings"])
listing_service = ListingService()

@listing_router.post("/", response_model=ListingOut, status_code=status.HTTP_201_CREATED)
async def create_listing(listing_data: ListingCreate):
    """Create a new listing"""
    try:
        listing = await listing_service.create_listing(listing_data)
        return listing
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create listing: {str(e)}"
        )

@listing_router.get("/{listing_id}", response_model=ListingOut)
async def get_listing(listing_id: str):
    """Get a listing by ID"""
    listing = await listing_service.get_listing(listing_id)
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    return listing

@listing_router.get("/", response_model=List[ListingOut])
async def get_all_listings():
    """Get all listings"""
    try:
        listings = await listing_service.get_all_listings()
        return listings
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch listings: {str(e)}"
        )

@listing_router.put("/{listing_id}", response_model=ListingOut)
async def update_listing(listing_id: str, listing_data: ListingUpdate):
    """Update a listing"""
    listing = await listing_service.update_listing(listing_id, listing_data)
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found or no changes made"
        )
    return listing

@listing_router.delete("/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_listing(listing_id: str):
    """Delete a listing"""
    success = await listing_service.delete_listing(listing_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )
    return None 