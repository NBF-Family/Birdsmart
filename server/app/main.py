from fastapi import FastAPI
from app.controllers import auth_controller, health_controller
from app.database.db import connect_to_mongo, close_mongo_connection

def create_app() -> FastAPI:
    app = FastAPI(title="Birdsmart API", version="0.1.0")

    # Database connection events
    app.add_event_handler("startup", connect_to_mongo)
    app.add_event_handler("shutdown", close_mongo_connection)

    # Include routers
    app.include_router(auth_controller.router)
    app.include_router(health_controller.router)
    return app

app = create_app()