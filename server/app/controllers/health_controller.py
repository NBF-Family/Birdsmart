from fastapi import APIRouter
from datetime import datetime, timezone

router = APIRouter(tags=["Health"])

@router.get("/")
async def health():
    return {
        "status": "OK",
        "message": "Backend is healthy and running",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

