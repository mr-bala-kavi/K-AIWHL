from fastapi import APIRouter, HTTPException, Body, Response
from models.challenges import DifficultyLevel
from utils.database import users_collection
import base64

router = APIRouter()

@router.post("/login")
async def login_low(username: str = Body(...), password: str = Body(...), difficulty: str = "low"):
    """
    CHALLENGE: SQL Injection - Authentication Bypass (Low)
    
    Low difficulty: Verbose errors, obvious vulnerability
    Medium: No error messages
    High: Prepared statements with intentional flaw
    
    OBJECTIVE: Bypass authentication without valid credentials
    FLAG LOCATION: flag{AUTH_L1_sql_1nj3ct_l0g1n} returned in JWT after successful bypass
    
    EXPLOITATION:
    - Low: username=admin' OR '1'='1'-- &password=anything
    - Must use Burp Suite to modify request
    """
    
    if difficulty == "low":
        # VULNERABLE: Direct string concatenation
        try:
            query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
            
            # Simulate SQL injection vulnerability
            if "' OR '" in username or "' OR " in username or "-- " in username or "#" in username:
                # Successful SQL injection bypass
                return {
                    "success": True,
                    "message": "Login successful!",
                    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + base64.b64encode(
                        b'{"user":"admin","role":"admin","flag":"flag{AUTH_L1_sql_1nj3ct_l0g1n}"}'
                    ).decode(),
                    "hint": "Decode the JWT to get the flag"
                }
            else:
                raise HTTPException(
                    status_code=401,
                    detail=f"SQL Error: Invalid credentials in query: {query}"  # Verbose error
                )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    elif difficulty == "medium":
        # Medium: No error messages, boolean response only
        if "' OR '" in username or "-- " in username:
            return {"success": True, "redirect": "/dashboard"}
        else:
            return {"success": False}  # No details
    
    else:
        raise HTTPException(status_code=400, detail="Invalid difficulty")

@router.post("/search")
async def search_products(query: str = Body(..., embed=True), difficulty: str = "medium"):
    """
    CHALLENGE: Blind SQL Injection (Medium)
    
    OBJECTIVE: Extract flag from admin_secrets table using blind SQLi
    FLAG: flag{AUTH_M1_bl1nd_sqli_h4sh}
    
    EXPLOITATION:
    Must use boolean-based blind SQLi:
    query=' AND (SELECT SUBSTRING(value,1,1) FROM admin_secrets WHERE key='flag')='f'--
    
    Or use sqlmap:
    sqlmap -u http://target/challenges/auth/search --data="query=test" --dump -T admin_secrets
    """
    
    # Simulated blind SQLi - returns only boolean
    if "SUBSTRING" in query and "admin_secrets" in query:
        # Simulate checking each character
        if "'f'" in query or '"f"' in query:
            return {"found": True}  # First char is'f'
        else:
            return {"found": False}
    
    # Normal search
    return {"found": False, "hint": "Try extracting data character by character"}

@router.post("/register")
async def register(username: str = Body(...), password: str = Body(...), email: str = Body(...)):
    """
    CHALLENGE: Second-Order SQL Injection (High)
    
    OBJECTIVE: Inject malicious payload in username during registration,
    then trigger it when profile is loaded
    
    FLAG LOCATION: Stored in database after successful second-order injection
    """
    
    # VULNERABLE: Stores user input without sanitization
    # Will be executed later when profile is retrieved
    user = {
        "username": username,  # No sanitization!
        "email": email,
        "password": password,
        "bio": f"User {username} joined"
    }
    
    # Simulated second-order injection
    if "'; DROP TABLE" in username or "1'; UPDATE" in username:
        return {
            "success": True,
            "message": "Registration successful. Your payload will execute on next profile view!",
            "hint": "Update your profile to trigger the injection"
        }
    
    return {"success": True, "message": "Registered successfully"}

@router.get("/profile/{username}")
async def get_profile_secondorder(username: str):
    """
    Triggers second-order SQL injection from stored username
    """
    # This would execute the malicious SQL stored in username field
    query = f"SELECT * FROM user_profiles WHERE username='{username}'"
    
    # Simulate second-order SQLi triggering
    if "'; UPDATE" in username:
        return {
            "message": "Second-order SQL injection triggered!",
            "flag": "flag{AUTH_H1_s3c0nd_0rd3r_pwn}",
            "data": {"username": "admin", "role": "admin"}
        }
    
    return {"username": username, "bio": "Regular user"}

@router.post("/session-fixation")
async def session_fixation_challenge(user_id: str = Body(..., embed=True)):
    """
    CHALLENGE: Session Fixation (Medium)
    
    OBJECTIVE: Force a session ID on a victim to hijack their session
    FLAG: flag{SESS_M1_f1x4t10n_pwn3d}
    
    EXPLOITATION:
    1. Attacker gets session ID from server
    2. Attacker sends victim link with session ID
    3. Victim logs in with that session ID
    4. Attacker uses same session ID to access victim's account
    
    Example:
    POST /challenges/auth/session-fixation
    {"user_id": "victim", "session_id": "attacker_controlled_session"}
    
    Tools: Burp Suite to set Cookie header
    """
    
    # VULNERABLE: Accepts session ID from user input
    # No session regeneration after login
    import random
    session_id = f"sess_{random.randint(1000, 9999)}"
    
    return {
        "message": "Session created",
        "session_id": session_id,
        "user_id": user_id,
        "flag": "flag{SESS_M1_f1x4t10n_pwn3d}",
        "note": "Session ID not regenerated after login - vulnerable to fixation",
        "hint": "In Burp, set Cookie to victim's session ID before they log in"
    }

@router.post("/jwt-race")
async def jwt_race_condition(token: str = Body(..., embed=True)):
    """
    CHALLENGE: JWT Race Condition (High)
    
    OBJECTIVE: Exploit race condition in JWT refresh to escalate privileges
    FLAG: flag{JWT_H1_r4c3_c0nd1t10n}
    
    EXPLOITATION:
    1. Get normal user JWT token  
    2. Send multiple simultaneous refresh requests
    3. Race condition allows role elevation
    4. One request gets admin role
    
    Example using Burp Intruder:
    - Load request in Repeater
    - Send to Intruder
    - Set thread count to 20-50
    - Fire all requests simultaneously
    
    Tools: Burp Suite Intruder (Pitchfork mode)
    """
    
    # Simulated race condition
    import random
    if random.random() < 0.2:  # 20% chance = race window
        return {
            "success": True,
            "new_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4ifQ==",
            "role": "admin",
            "flag": "flag{JWT_H1_r4c3_c0nd1t10n}",
            "note": "Race condition exploited! You became admin"
        }
    
    return {
        "success": False,
        "hint": "Try sending multiple simultaneous requests (Burp Intruder)"
    }

