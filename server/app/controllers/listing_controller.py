from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from ..models.list_model import ListingCreate, ListingOut, ListingUpdate
from ..models.user_model import UserOut
from ..services.dependencies import get_current_user
from ..services.listing_service import (
    create_listing_service,
    get_listing_service,
    get_all_listings_service,
    get_user_listings_service,
    update_listing_service,
    delete_listing_service
)

listing_router = APIRouter(prefix="/listings", tags=["Listings"])

@listing_router.post("/", response_model=ListingOut, status_code=status.HTTP_201_CREATED)
async def create_listing(listing_data: ListingCreate, current_user: UserOut = Depends(get_current_user)):
    """Create a new listing"""
    try:
        listing = await create_listing_service(listing_data, current_user)
        return listing
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create listing: {str(e)}"
        )

@listing_router.get("/{listing_id}", response_model=ListingOut)
async def get_listing(listing_id: str):
    """Get a listing by ID"""
    listing = await get_listing_service(listing_id)
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
        listings = await get_all_listings_service()
        return listings
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch listings: {str(e)}"
        )

@listing_router.get("/my-listings", response_model=List[ListingOut])
async def get_my_listings(current_user: UserOut = Depends(get_current_user)):
    """Get all listings belonging to the current user"""
    try:
        listings = await get_user_listings_service(current_user)
        return listings
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch your listings: {str(e)}"
        )

@listing_router.put("/{listing_id}", response_model=ListingOut)
async def update_listing(listing_id: str, listing_data: ListingUpdate, current_user: UserOut = Depends(get_current_user)):
    """Update a listing"""
    try:
        listing = await update_listing_service(listing_id, listing_data, current_user)
        if not listing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Listing not found or no changes made"
            )
        return listing
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )

@listing_router.delete("/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_listing(listing_id: str, current_user: UserOut = Depends(get_current_user)):
    """Delete a listing"""
    try:
        success = await delete_listing_service(listing_id, current_user)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Listing not found"
            )
        return None
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        ) 