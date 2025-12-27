from fastapi import APIRouter, HTTPException, Depends
from models.challenges import FlagSubmission, Challenge, UserProgress, DifficultyLevel, Category
from utils.database import db
from typing import List

router = APIRouter()

# Flags registry - embedded directly (no file loading)
# Total: 25 challenges, 1100 points
FLAGS_REGISTRY = {
    # Authentication & Sessions (5 challenges - 210 pts)
    "auth_sql_low": {"flag": "flag{AUTH_L1_sql_1nj3ct_l0g1n}", "points": 10, "category": "authentication", "difficulty": "low"},
    "auth_sql_medium": {"flag": "flag{AUTH_M1_bl1nd_sqli_h4sh}", "points": 25, "category": "authentication", "difficulty": "medium"},
    "auth_second_order_high": {"flag": "flag{AUTH_H1_s3c0nd_0rd3r_pwn}", "points": 50, "category": "authentication", "difficulty": "high"},
    "session_fixation_medium": {"flag": "flag{SESS_M1_f1x4t10n_pwn3d}", "points": 25, "category": "authentication", "difficulty": "medium"},
    "jwt_race_high": {"flag": "flag{JWT_H1_r4c3_c0nd1t10n}", "points": 50, "category": "authentication", "difficulty": "high"},
    
    # Injection Attacks (5 challenges - 245 pts)
    "cmd_injection_low": {"flag": "flag{CMD_L1_p1ng_1nj3ct10n}", "points": 10, "category": "injection", "difficulty": "low"},
    "nosql_blind_medium": {"flag": "flag{NOSQL_M1_bl1nd_1nj3ct}", "points": 25, "category": "injection", "difficulty": "medium"},
    "ldap_injection_high": {"flag": "flag{LDAP_H1_d1r3ct0ry_pwn}", "points": 50, "category": "injection", "difficulty": "high"},
    "xxe_extreme": {"flag": "flag{XXE_E1_1nt3rn4l_f1l3s}", "points": 100, "category": "injection", "difficulty": "extreme"},
    "ssti_medium": {"flag": "flag{SSTI_M1_t3mpl4t3_pwn}", "points": 25, "category": "injection", "difficulty": "medium"},
    
    # File & Upload (4 challenges - 185 pts)
    "upload_low": {"flag": "flag{UPLOAD_L1_unr3str1ct3d}", "points": 10, "category": "file", "difficulty": "low"},
    "lfi_medium": {"flag": "flag{LFI_M1_l0c4l_f1l3_r34d}", "points": 25, "category": "file", "difficulty": "medium"},
    "rfi_high": {"flag": "flag{RFI_H1_r3m0t3_c0d3_3x3c}", "points": 50, "category": "file", "difficulty": "high"},
    "polyglot_extreme": {"flag": "flag{POL_E1_p0lygl0t_byp4ss}", "points": 100, "category": "file", "difficulty": "extreme"},
    
    # LLM/AI Security (4 challenges - 185 pts)
    "llm_prompt_low": {"flag": "flag{LLM_L1_pr0mpt_l34k}", "points": 10, "category": "llm", "difficulty": "low"},
    "llm_jailbreak_medium": {"flag": "flag{LLM_M1_j41lbr34k_pwn}", "points": 25, "category": "llm", "difficulty": "medium"},
    "rag_poisoning_high": {"flag": "flag{RAG_H1_p0is0n_r3tr13v3}", "points": 50, "category": "llm", "difficulty": "high"},
    "context_smuggling_extreme": {"flag": "flag{CTX_E1_c0nt3xt_smug}", "points": 100, "category": "llm", "difficulty": "extreme"},
    
    # Access Control (4 challenges - 185 pts)
    "idor_low": {"flag": "flag{IDOR_L1_us3r_4cc3ss}", "points": 10, "category": "access_control", "difficulty": "low"},
    "mass_assign_medium": {"flag": "flag{MASS_M1_4ss1gn_pwn}", "points": 25, "category": "access_control", "difficulty": "medium"},
    "race_condition_high": {"flag": "flag{PRIV_H1_r4c3_3sc4l4t3}", "points": 50, "category": "access_control", "difficulty": "high"},
    "oauth_csrf_extreme": {"flag": "flag{OAUTH_E1_t0k3n_ch41n}", "points": 100, "category": "access_control", "difficulty": "extreme"},
    
    # SSRF & Network (3 challenges - 175 pts)
    "ssrf_internal_medium": {"flag": "flag{SSRF_M1_1nt3rn4l_4p1}", "points": 25, "category": "ssrf", "difficulty": "medium"},
    "crlf_injection_high": {"flag": "flag{CRLF_H1_h34d3r_1nj3ct}", "points": 50, "category": "ssrf", "difficulty": "high"},
    "cloud_metadata_extreme": {"flag": "flag{CLOUD_E1_m3t4d4t4_pwn}", "points": 100, "category": "ssrf", "difficulty": "extreme"},
}

# Import all challenge definitions from modular files
try:
    from routes.challenge_definitions.auth_challenges_def import AUTH_CHALLENGES
    from routes.challenge_definitions.injection_challenges_def import INJECTION_CHALLENGES
    from routes.challenge_definitions.file_challenges_def import FILE_CHALLENGES
    from routes.challenge_definitions.llm_challenges_def import LLM_CHALLENGES
    from routes.challenge_definitions.access_challenges_def import ACCESS_CHALLENGES
    from routes.challenge_definitions.ssrf_challenges_def import SSRF_CHALLENGES
    
    # Merge all challenges into single dictionary
    CHALLENGES = {
        **AUTH_CHALLENGES,      # 5 challenges - 210 pts
        **INJECTION_CHALLENGES, # 5 challenges - 245 pts  
        **FILE_CHALLENGES,      # 4 challenges - 185 pts
        **LLM_CHALLENGES,       # 4 challenges - 185 pts
        **ACCESS_CHALLENGES,    # 4 challenges - 185 pts
        **SSRF_CHALLENGES,      # 3 challenges - 175 pts
    }
    # Total: 25 challenges, 1100 points
    
except ImportError as e:
    print(f"Warning: Could not import challenge definitions: {e}")
    # Fallback: minimal challenges dict
    CHALLENGES = {}

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
