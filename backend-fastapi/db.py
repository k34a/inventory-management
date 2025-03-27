from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
import cfg

class Product(BaseModel):
    name: str
    description: str
    price: float
    category: str

class User(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

client = AsyncIOMotorClient(cfg.DATABASE_URL)
db = client["testdb"]