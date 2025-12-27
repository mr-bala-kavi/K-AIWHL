"""
Authentication & Session Management Challenges
5 challenges - 210 points total
"""
from models.challenges import Challenge, DifficultyLevel, Category

AUTH_CHALLENGES = {
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
    "auth_second_order_high": Challenge(
        id="auth_second_order_high",
        title="Second-Order SQL Injection",
        category=Category.AUTHENTICATION,
        difficulty=DifficultyLevel.HIGH,
        points=50,
        description="Exploit second-order SQL injection through data persistence",
        objective="Escalate privileges using stored malicious username",
        hints=[
            "Register with SQL injection in username",
            "The injection triggers when your profile is viewed",
            "Try: admin'; UPDATE users SET role='admin'--"
        ],
        tools_needed=["Burp Suite", "sqlmap"],
        endpoint="/challenges/auth/register"
    ),
    "session_fixation_medium": Challenge(
        id="session_fixation_medium",
        title="Session Fixation Attack",
        category=Category.AUTHENTICATION,
        difficulty=DifficultyLevel.MEDIUM,
        points=25,
        description="Force a user to use a known session identifier",
        objective="Hijack a victim's session using session fixation",
        hints=[
            "Session IDs are not regenerated after login",
            "Set a known session ID before victim logs in",
            "Predict or force the session token"
        ],
        tools_needed=["Burp Suite", "Browser"],
        endpoint="/challenges/auth/session-fixation"
    ),
    "jwt_race_high": Challenge(
        id="jwt_race_high",
        title="JWT Race Condition",
        category=Category.AUTHENTICATION,
        difficulty=DifficultyLevel.HIGH,
        points=50,
        description="Exploit race condition in JWT token validation",
        objective="Bypass JWT validation through concurrent requests",
        hints=[
            "Send multiple token requests simultaneously",
            "Use Burp Intruder with 20+ parallel requests",
            "Race condition in token expiry check"
        ],
        tools_needed=["Burp Suite Intruder", "Python threading"],
        endpoint="/challenges/auth/jwt-race"
    ),
}
