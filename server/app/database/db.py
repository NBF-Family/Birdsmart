from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "Birdsmart")  # Use existing database name

# Create async client
client = AsyncIOMotorClient(MONGO_URL)

# Get database
db = client[DATABASE_NAME]

# Collections
users_collection = db.User
lists_collection = db.Listing

async def connect_to_mongo():
    """Test MongoDB connection"""
    try:
        # Test connection
        await client.admin.command('ping')
        print("✅ Successfully connected to MongoDB!")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        raise e

async def close_mongo_connection():
    """Close MongoDB connection"""
    client.close()
    print("🔌 MongoDB connection closed")