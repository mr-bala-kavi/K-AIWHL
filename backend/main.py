from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = FastAPI(title="K-AIWHL v2.0 - Modern AI CTF Lab", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # Cannot use credentials with wildcard origins
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load challenge routes incrementally
loaded_modules = []
try:
    from routes import challenges
    app.include_router(challenges.router, prefix="/api", tags=["challenges"])
    loaded_modules.append("challenges (core)")
except Exception as e:
    print(f"Warning: Could not load challenges core: {e}")

try:
    from challenges import auth_challenges
    app.include_router(auth_challenges.router, prefix="/challenges/auth", tags=["auth"])
    loaded_modules.append("auth")
except Exception as e:
    print(f"Warning: Could not load auth challenges: {e}")

try:
    from challenges import file_challenges
    app.include_router(file_challenges.router, prefix="/challenges/file", tags=["file"])
    loaded_modules.append("file")
except Exception as e:
    print(f"Warning: Could not load file challenges: {e}")

try:
    from challenges import access_challenges
    app.include_router(access_challenges.router, prefix="/challenges/access", tags=["access"])
    loaded_modules.append("access")
except Exception as e:
    print(f"Warning: Could not load access challenges: {e}")

try:
    from challenges import ssrf_challenges
    app.include_router(ssrf_challenges.router, prefix="/challenges/ssrf", tags=["ssrf"])
    loaded_modules.append("ssrf")
except Exception as e:
    print(f"Warning: Could not load ssrf challenges: {e}")

try:
    from challenges import injection_challenges
    app.include_router(injection_challenges.router, prefix="/challenges/injection", tags=["injection"])
    loaded_modules.append("injection")
except Exception as e:
    print(f"Warning: Could not load injection challenges: {e}")

try:
    from challenges import llm_challenges
    app.include_router(llm_challenges.router, prefix="/challenges/llm", tags=["llm"])
    loaded_modules.append("llm")
except Exception as e:
    print(f"Warning: Could not load llm challenges: {e}")

print(f"✅ Loaded challenge modules: {', '.join(loaded_modules)}")

@app.get("/")
async def root():
    return {
        "name": "K-AIWHL v2.0",
        "version": "2.0.0",
        "description": "Modern AI-Integrated Penetration Testing Lab",
        "total_challenges": 25,  # All challenges implemented
        "total_points": 1100,  # 5 low (50) + 10 medium (250) + 6 high (300) + 4 extreme (400) = 1100
        "categories": ["authentication", "injection", "file", "llm", "access_control", "ssrf"],
        "difficulty_levels": ["low", "medium", "high", "extreme"],
        "endpoints": {
            "challenges": "/api/challenges",
            "submit_flag": "/api/challenges/submit-flag",
            "progress": "/api/progress/{user_id}",
            "leaderboard": "/api/leaderboard"
        },
        "message": "Flags are hidden - use Burp Suite and Kali Linux tools to find them!"
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
