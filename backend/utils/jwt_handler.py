from jose import jwt, JWTError
from datetime import datetime, timedelta
import os

SECRET_KEY = os.getenv("JWT_SECRET", "super_secret_key_do_not_use_in_production")
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str):
    """
    VULNERABILITY 2: JWT Forgery - Algorithm 'none' Accepted
    Flag: flag{KAI_JWT_n0_alg_n0_pr0bl3m}
    
    This function decodes JWT without proper algorithm validation.
    An attacker can create a token with "alg": "none" and no signature.
    """
    try:
        # VULNERABLE: options={"verify_signature": False} allows alg: none
        payload = jwt.decode(
            token, 
            SECRET_KEY, 
            algorithms=["HS256", "none"],  # VULNERABLE: Accepts 'none'
            options={"verify_signature": False}  # VULNERABLE: No signature verification
        )
        return payload
    except JWTError:
        return None
