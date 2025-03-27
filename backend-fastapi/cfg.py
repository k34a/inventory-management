from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
import os

DATABASE_URL = os.getenv("MONGODB_URI")
SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")