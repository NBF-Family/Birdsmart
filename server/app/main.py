from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers import auth_controller, health_controller, listing_controller
from app.database.db import connect_to_mongo, close_mongo_connection

def create_app() -> FastAPI:
    app = FastAPI(title="Birdsmart API", version="0.1.0")

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # React dev server
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Database connection events
    app.add_event_handler("startup", connect_to_mongo)
    app.add_event_handler("shutdown", close_mongo_connection)

    # Include routers
    app.include_router(auth_controller.router)
    app.include_router(health_controller.router)
    app.include_router(listing_controller.listing_router)
    return app

app = create_app()