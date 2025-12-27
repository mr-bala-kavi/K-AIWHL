from fastapi import APIRouter, HTTPException, Depends
from models.challenges import FlagSubmission, Challenge, UserProgress, DifficultyLevel, Category
from utils.database import db
from typing import List

router = APIRouter()

# Flags registry - embedded directly (no file loading)
FLAGS_REGISTRY = {
    "auth_sql_low": {"flag": "flag{AUTH_L1_sql_1nj3ct_l0g1n}", "points": 10, "category": "authentication", "difficulty": "low"},
    "auth_sql_medium": {"flag": "flag{AUTH_M1_bl1nd_sqli_h4sh}", "points": 25, "category": "authentication", "difficulty": "medium"},
    "idor_low": {"flag": "flag{IDOR_L1_us3r_4cc3ss}", "points": 10, "category": "access_control", "difficulty": "low"},
    "mass_assign_medium": {"flag": "flag{MASS_M1_4ss1gn_pwn}", "points": 25, "category": "access_control", "difficulty": "medium"},
    "ssrf_internal_medium": {"flag": "flag{SSRF_M1_1nt3rn4l_4p1}", "points": 25, "category": "ssrf", "difficulty": "medium"},
    "upload_low": {"flag": "flag{UPLOAD_L1_unr3str1ct3d}", "points": 10, "category": "file", "difficulty": "low"},
    "lfi_medium": {"flag": "flag{LFI_M1_l0c4l_f1l3_r34d}", "points": 25, "category": "file", "difficulty": "medium"},
    "llm_prompt_low": {"flag": "flag{LLM_L1_pr0mpt_l34k}", "points": 10, "category": "llm", "difficulty": "low"},
   "llm_jailbreak_medium": {"flag": "flag{LLM_M1_j41lbr34k_pwn}", "points": 25, "category": "llm", "difficulty": "medium"},
}

# Challenge definitions
CHALLENGES = {
    # Authentication challenges
    "auth_sql_low": Challenge(
        id="auth_sql_low",
        title="SQL Injection - Authentication Bypass",
        category=Category.AUTHENTICATION,
        difficulty=DifficultyLevel.LOW,
        points=10,
        description="The login form is vulnerable to SQL injection. Can you bypass authentication?",
        objective="Login as admin without knowing the password",
        hints=[
            "Try using SQL operators like OR, AND",
            "The classic payload is: admin' OR '1'='1",
            "You need to comment out the rest of the query with -- or #"
        ],
        tools_needed=["Burp Suite", "Browser"],
        endpoint="/challenges/auth/login"
    ),
    "auth_sql_medium": Challenge(
        id="auth_sql_medium",
        title="Blind SQL Injection - Data Extraction",
        category=Category.AUTHENTICATION,
        difficulty=DifficultyLevel.MEDIUM,
        points=25,
        description="Extract the admin password hash using blind SQL injection",
        objective="Find the flag hidden in admin_secrets table",
        hints=[
            "Use boolean-based blind SQLi with SUBSTRING",
            "Try: ' AND (SELECT SUBSTRING(value,1,1) FROM admin_secrets WHERE key='flag')='f'--",
            "Use sqlmap: sqlmap -u URL --data='query=test' --dump -T admin_secrets"
        ],
        tools_needed=["Burp Suite", "sqlmap", "Python"],
        endpoint="/challenges/auth/search"
    ),
    # Add more challenge definitions...
}

@router.get("/challenges", response_model=List[Challenge])
async def list_challenges(
    category: Category = None,
    difficulty: DifficultyLevel = None
):
    """
    List all available challenges, optionally filtered by category/difficulty
    """
    challenges = list(CHALLENGES.values())
    
    if category:
        challenges = [c for c in challenges if c.category == category]
    
    if difficulty:
        challenges = [c for c in challenges if c.difficulty == difficulty]
    
    return challenges

@router.get("/challenges/{challenge_id}", response_model=Challenge)
async def get_challenge(challenge_id: str):
    """
    Get details for a specific challenge
    """
    if challenge_id not in CHALLENGES:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    return CHALLENGES[challenge_id]

@router.post("/challenges/submit-flag")
async def submit_flag(submission: FlagSubmission, user_id: str = "default_user"):
    """
    Submit a flag for validation
    NO DIRECT FLAG EXPOSURE - flags must be discovered through exploitation
    """
    challenge_id = submission.challenge_id
    submitted_flag = submission.flag.strip()
    
    # Validate challenge exists
    if challenge_id not in FLAGS_REGISTRY:
        raise HTTPException(status_code=404, detail="Invalid challenge ID")
    
    # Get the correct flag
    challenge_data = FLAGS_REGISTRY[challenge_id]
    correct_flag = challenge_data["flag"]
    
    # Check if flag is correct
    if submitted_flag == correct_flag:
        # Calculate points
        base_points = challenge_data["points"]
        points_earned = base_points // 2 if submission.used_hint else base_points
        
        # Update user progress
        user_progress = db.user_progress.find_one({"user_id": user_id})
        
        if not user_progress:
            user_progress = {
                "user_id": user_id,
                "solved_challenges": [],
                "total_points": 0,
                "hints_used": 0
            }
        
        # Check if already solved
        if challenge_id in user_progress.get("solved_challenges", []):
            return {
                "correct": True,
                "message": "You've already solved this challenge!",
                "points_earned": 0,
                "total_points": user_progress["total_points"]
            }
        
        # Add to solved list
        db.user_progress.update_one(
            {"user_id": user_id},
            {
                "$addToSet": {"solved_challenges": challenge_id},
                "$inc": {
                    "total_points": points_earned,
                    "hints_used": 1 if submission.used_hint else 0
                }
            },
            upsert=True
        )
        
        return {
            "correct": True,
            "message": f"Congratulations! Challenge solved!",
            "points_earned": points_earned,
            "total_points": user_progress["total_points"] + points_earned,
            "challenge_category": challenge_data["category"],
            "difficulty": challenge_data["difficulty"]
        }
    
    else:
        return {
            "correct": False,
            "message": "Incorrect flag. Keep trying!",
            "hint": "Make sure you've properly exploited the vulnerability"
        }

@router.get("/progress/{user_id}", response_model=UserProgress)
async def get_user_progress(user_id: str):
    """
    Get user's progress and solved challenges
    """
    progress = db.user_progress.find_one({"user_id": user_id})
    
    if not progress:
        return UserProgress(
            user_id=user_id,
            username=user_id,
            solved_challenges=[],
            total_points=0,
            hints_used=0
        )
    
    progress.pop('_id', None)
    return UserProgress(**progress)

@router.get("/leaderboard")
async def get_leaderboard(limit: int = 10):
    """
    Get top scorers
    """
    leaderboard = list(db.user_progress.find(
        {},
        {"_id": 0}
    ).sort("total_points", -1).limit(limit))
    
    return {"leaderboard": leaderboard}

@router.post("/challenges/{challenge_id}/hint")
async def get_hint(challenge_id: str, hint_number: int, user_id: str = "default_user"):
    """
    Get a hint for a challenge (reduces points by 50%)
    """
    if challenge_id not in CHALLENGES:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    challenge = CHALLENGES[challenge_id]
    
    if hint_number >= len(challenge.hints):
        raise HTTPException(status_code=404, detail="Hint not available")
    
    return {
        "hint": challenge.hints[hint_number],
        "warning": "Using hints reduces points by 50%!",
        "remaining_hints": len(challenge.hints) - hint_number - 1
    }
