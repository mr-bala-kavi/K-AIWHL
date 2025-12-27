from fastapi import APIRouter, HTTPException, Body
from models.schemas import LoginRequest, Token
from utils.database import users_collection
from utils.jwt_handler import create_access_token
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/login", response_model=Token)
async def login(credentials: dict = Body(...)):
    """
    VULNERABILITY 1: NoSQL Injection
    Flag: flag{KAI_NOSQL_m0ng0_1nj3ct10n_w0rks}
    
    This endpoint accepts a raw dictionary and passes it directly to MongoDB.
    Exploit: {"username": {"$ne": null}, "password": {"$ne": null}}
    This will match any user without knowing credentials.
    """
    # VULNERABLE: Direct dictionary passed to MongoDB find()
    user = users_collection.find_one(credentials)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create access token
    access_token = create_access_token(
        data={
            "sub": user["username"],
            "role": user.get("role", "user"),
            "flag": user.get("flag", None)  # Flag embedded in token for successful NoSQL injection
        }
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register")
async def register(username: str, password: str, email: str):
    """Simple registration endpoint"""
    if users_collection.find_one({"username": username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    
    hashed_password = pwd_context.hash(password)
    user = {
        "username": username,
        "email": email,
        "password": hashed_password,
        "role": "user"
    }
    
    users_collection.insert_one(user)
    return {"message": "User registered successfully"}

@router.get("/protected")
async def protected_route():
    """
    This route demonstrates JWT forgery vulnerability.
    With alg: none, you can access this without valid signature.
    """
    return {
        "message": "You accessed a protected route!",
        "flag": "flag{KAI_JWT_n0_alg_n0_pr0bl3m}"
    }
