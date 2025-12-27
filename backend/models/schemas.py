from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    username: str
    email: str
    role: str = "user"
    secret_data: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ChatRequest(BaseModel):
    message: str
    use_rag: bool = False

class FetchRequest(BaseModel):
    url: str

class OAuthCallback(BaseModel):
    code: str
    state: Optional[str] = None
