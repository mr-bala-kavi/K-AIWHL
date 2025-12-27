from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

class DifficultyLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    EXTREME = "extreme"

class Category(str, Enum):
    AUTHENTICATION = "authentication"
    INJECTION = "injection"
    FILE = "file"
    LLM = "llm"
    ACCESS_CONTROL = "access_control"
    SSRF = "ssrf"

class Challenge(BaseModel):
    id: str
    title: str
    category: Category
    difficulty: DifficultyLevel
    points: int
    description: str
    objective: str
    hints: List[str] = []
    tools_needed: List[str] = []
    endpoint: Optional[str] = None

class FlagSubmission(BaseModel):
    challenge_id: str
    flag: str
    used_hint: bool = False

class UserProgress(BaseModel):
    user_id: str
    username: str
    solved_challenges: List[str] = []
    total_points: int = 0
    hints_used: int = 0

class ChallengeAttempt(BaseModel):
    challenge_id: str
    flag_submitted: str
    success: bool
    points_earned: int
    timestamp: str
