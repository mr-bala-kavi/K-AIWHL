from fastapi import APIRouter, HTTPException
from models.challenges import DifficultyLevel
import base64

router = APIRouter()

@router.get("/user/{user_id}")
async def get_user_idor(user_id: str, difficulty: str = "low"):
    """
    CHALLENGE: IDOR - Insecure Direct Object Reference (Low)
    
    OBJECTIVE: Access other users' data without authorization
    FLAG LOCATION: Base64 encoded in secret_data field for user_id=admin
    FLAG: flag{IDOR_L1_us3r_4cc3ss}
    
    EXPLOITATION:
    1. Use Burp Suite to intercept request
    2. Modify user_id parameter to access other users
    3. Try: admin, user1, user2, etc.
    4. Decode base64 secret_data to get flag
    
    Example:
    GET /challenges/access/user/admin
    Response contains: "secret_data": "ZmxhZ3tJRE9SX0wxX3VzM3JfNGNjM3NzfQ=="
    Decode: echo "ZmxhZ3tJRE9SX0wxX3VzM3JfNGNjM3NzfQ==" | base64 -d
    """
    
    # VULNERABLE: No authorization check
    users_db = {
        "user1": {
            "username": "user1",
            "email": "user1@example.com",
            "role": "user",
            "secret_data": base64.b64encode(b"Normal user data").decode()
        },
        "admin": {
            "username": "admin",
            "email": "admin@kaiwhl.local",
            "role": "admin",
            "secret_data": base64.b64encode(b"flag{IDOR_L1_us3r_4cc3ss}").decode()
        }
    }
    
    if user_id in users_db:
        return users_db[user_id]
    
    raise HTTPException(status_code=404, detail="User not found")

@router.post("/update-profile")
async def mass_assignment(user_id: str, **kwargs):
    """
    CHALLENGE: Mass Assignment (Medium)
    
    OBJECTIVE: Escalate privileges by assigning admin role
    FLAG: flag{MASS_M1_4ss1gn_pwn}
    
    EXPLOITATION:
    1. Intercept profile update in Burp Suite
    2. Add "role": "admin" to request body
    3. Server accepts all parameters without filtering
    
    POST /challenges/access/update-profile?user_id=user1
    {"name": "John", "email": "john@test.com", "role": "admin"}
    
    Tool: Burp Suite Repeater
    """
    
    # VULNERABLE: Accepts all parameters
    if "role" in kwargs and kwargs["role"] == "admin":
        return {
            "message": "Profile updated successfully",
            "role": "admin",
            "flag": "flag{MASS_M1_4ss1gn_pwn}",
            "note": "Privilege escalation via mass assignment"
        }
    
    return {"message": "Profile updated"}

@router.post("/privilege-escalation")
async def race_condition_priv(user_id: str):
    """
    CHALLENGE: Race Condition Privilege Escalation (High)
    
    OBJECTIVE: Exploit race condition to gain admin privileges
    FLAG: flag{PRIV_H1_r4c3_3sc4l4t3}
    
    EXPLOITATION:
    1. Send multiple simultaneous requests to elevate privilege
    2. Use Burp Suite Intruder with single payload mode
    3. Thread count: 20-50
    4. Race the privilege check vs. role assignment
    
    Tool: Burp Suite Intruder (Pitchfork attack)
    Command: for i in {1..50}; do curl -X POST url & done
    """
    
    # Simulated race condition vulnerability
    import random
    if random.random() < 0.3:  # 30% chance (simulates race window)
        return {
            "message": "Race condition exploited!",
            "role": "admin",
            "flag": "flag{PRIV_H1_r4c3_3sc4l4t3}",
            "note": "You won the race and became admin"
        }
    
    return {"message": "Privilege update failed", "hint": "Try multiple simultaneous requests"}

@router.get("/oauth-callback")
async def oauth_csrf_chain(code: str, state: str = None):
    """
    CHALLENGE: OAuth CSRF Chain (Extreme)
    
    OBJECTIVE: Chain OAuth callback vulnerability with CSRF to steal tokens
    FLAG: flag{OAUTH_E1_t0k3n_ch41n}
    
    EXPLOITATION:
    1. OAuth callback doesn't validate 'state' parameter
    2. Attacker initiates OAuth flow
    3. Attacker tricks victim to complete OAuth
    4. Attacker intercepts authorization code
    5. Attacker exchanges code for access token
    
    Attack chain:
    1. GET /challenges/access/oauth-init → Get auth URL
    2. Modify state parameter (CSRF vulnerability)
    3. Victim clicks malicious link
    4. Attacker gets callback with victim's code
    5. POST /challenges/access/oauth-token with code
    
    Tools: Burp Suite Collaborator, browser manipulation
    """
    
    # VULNERABLE: No state validation
    if not state:
        return {
            "error": "Missing state parameter",
            "hint": "State parameter is supposed to prevent CSRF, but it's not validated!"
        }
    
    # VULNERABLE: Accepts any authorization code
    if code:
        return {
            "success": True,
            "access_token": "oauth_access_token_stolen",
            "user_data": {
                "email": "victim@example.com",
                "role": "admin"
            },
            "flag": "flag{OAUTH_E1_t0k3n_ch41n}",
            "note": "OAuth CSRF successful - stolen victim's token",
            "vulnerability": "No state validation allows CSRF in OAuth flow"
        }
    
    return {"error": "Invalid authorization code"}

@router.get("/oauth-init")
async def oauth_init():
    """Helper endpoint to initiate OAuth flow"""
    import random
    state = f"state_{random.randint(1000, 9999)}"
    return {
        "auth_url": f"https://oauth-provider.com/authorize?state={state}",
        "state": state,
        "hint": "Modify the state parameter to perform CSRF attack"
    }

