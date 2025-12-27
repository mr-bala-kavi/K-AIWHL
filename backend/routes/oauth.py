from fastapi import APIRouter, HTTPException, Query
from utils.database import oauth_states
import secrets
import uuid

router = APIRouter()

# Simulated OAuth provider
OAUTH_CLIENT_ID = "fake_client_id"
OAUTH_CLIENT_SECRET = "fake_client_secret"

@router.get("/authorize")
async def oauth_authorize(redirect_uri: str):
    """
    Initiate OAuth flow
    In a real scenario, this would redirect to external OAuth provider
    """
    # Generate state parameter
    state = secrets.token_urlsafe(32)
    
    # VULNERABLE: State is generated but not properly validated in callback
    oauth_states.insert_one({
        "state": state,
        "redirect_uri": redirect_uri,
        "used": False
    })
    
    # In real scenario, would redirect to OAuth provider
    # For CTF, return the authorization URL
    auth_url = f"http://fake-oauth-provider.com/authorize?client_id={OAUTH_CLIENT_ID}&redirect_uri={redirect_uri}&state={state}"
    
    return {
        "authorization_url": auth_url,
        "state": state,
        "message": "In real scenario, user would be redirected to OAuth provider"
    }

@router.get("/callback")
async def oauth_callback(code: str, state: str = Query(None)):
    """
    VULNERABILITY 3: Broken OAuth State Validation
    Flag: flag{KAI_OAUTH_st4t3_c0nfus10n}
    
    This endpoint doesn't properly validate the state parameter.
    Exploit: 
    1. Omit the state parameter entirely
    2. Use an arbitrary state value
    3. Use a state from a different session
    
    This can lead to CSRF and session fixation attacks.
    """
    
    # VULNERABLE: State validation is commented out or improperly implemented
    # if not state:
    #     raise HTTPException(status_code=400, detail="Missing state parameter")
    
    # VULNERABLE: No actual validation of state against database
    # stored_state = oauth_states.find_one({"state": state, "used": False})
    # if not stored_state:
    #     raise HTTPException(status_code=400, detail="Invalid state parameter")
    
    # Simulate successful OAuth exchange
    # In reality, would exchange code for access token
    
    return {
        "message": "OAuth callback successful - state validation bypassed!",
        "flag": "flag{KAI_OAUTH_st4t3_c0nfus10n}",
        "access_token": "fake_oauth_token_" + secrets.token_urlsafe(16),
        "user": {
            "id": "oauth_user_123",
            "email": "user@example.com",
            "name": "OAuth User"
        },
        "vulnerable": True,
        "note": "State parameter was not validated, allowing CSRF attacks"
    }

@router.post("/token")
async def exchange_token(code: str):
    """
    Exchange authorization code for access token
    Also vulnerable due to no state validation in the flow
    """
    return {
        "access_token": f"oauth_access_token_{secrets.token_urlsafe(32)}",
        "token_type": "Bearer",
        "expires_in": 3600
    }
