from fastapi import Depends, HTTPException
from jose import JWTError, jwt
from datetime import datetime, timedelta
import cfg
import db

def hash_password(password: str):
    return cfg.pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return cfg.pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.now() + (expires_delta or timedelta(minutes=cfg.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, cfg.SECRET_KEY, algorithm=cfg.ALGORITHM)

async def get_current_user(token: str = Depends(cfg.oauth2_scheme)):
    try:
        payload = jwt.decode(token, cfg.SECRET_KEY, algorithms=[cfg.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        user = await db.db.users.find_one({"username": username})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")