from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .controllers import listing_router

app = FastAPI(
    title="Birdsmart API",
    description="API for bird trading platform",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(listing_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to Birdsmart API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
