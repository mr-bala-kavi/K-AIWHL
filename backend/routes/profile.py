from fastapi import APIRouter, HTTPException, Header
from utils.database import users_collection
from typing import Optional

router = APIRouter()

@router.get("/{user_id}")
async def get_profile(user_id: str, authorization: Optional[str] = Header(None)):
    """
    VULNERABILITY 9: Insecure Direct Object Reference (IDOR)
    Flag: flag{KAI_IDOR_pr0f1l3_l3ak3d}
    
    This endpoint returns any user's profile without checking authorization.
    Exploit: Simply change the user_id in the URL to access other users' data.
    Example: /api/profile/1, /api/profile/2, /api/profile/admin
    """
    
    # VULNERABLE: No authorization check
    # Should verify that the authenticated user can only access their own profile
    
    # Try to find user by ID or username
    user = users_collection.find_one({"$or": [
        {"user_id": user_id},
        {"username": user_id}
    ]})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # VULNERABLE: Returning sensitive data including secret_data field
    return {
        "user_id": user.get("user_id", user.get("username")),
        "username": user["username"],
        "email": user["email"],
        "role": user.get("role", "user"),
        "secret_data": user.get("secret_data", None),
        "flag": user.get("flag", None)
    }

@router.put("/{user_id}")
async def update_profile(user_id: str, data: dict):
    """
    IDOR in update - can modify any user's profile
    """
    # VULNERABLE: No authorization check
    result = users_collection.update_one(
        {"user_id": user_id},
        {"$set": data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "Profile updated", "user_id": user_id}
