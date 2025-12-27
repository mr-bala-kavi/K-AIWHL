"""
Access Control & Authorization Challenges
4 challenges - 185 points total
"""
from models.challenges import Challenge, DifficultyLevel, Category

ACCESS_CHALLENGES = {
    "idor_low": Challenge(
        id="idor_low",
        title="IDOR - Insecure Direct Object Reference",
        category=Category.ACCESS_CONTROL,
        difficulty=DifficultyLevel.LOW,
        points=10,
        description="Access other users' profiles without authorization",
        objective="Access admin profile and retrieve flag",
        hints=[
            "Change user ID in URL or request",
            "Enumerate IDs: 1, 2, admin, user",
            "No access control check exists"
        ],
        tools_needed=["Burp Suite", "curl"],
        endpoint="/challenges/access/user/:id"
    ),
    "mass_assign_medium": Challenge(
        id="mass_assign_medium",
        title="Mass Assignment - Privilege Escalation",
        category=Category.ACCESS_CONTROL,
        difficulty=DifficultyLevel.MEDIUM,
        points=25,
        description="Exploit mass assignment to elevate privileges",
        objective="Become admin by manipulating object properties",
        hints=[
            "API accepts all JSON properties",
            "Try: 'is_admin': true or 'role': 'admin'",
            "Modify registration/update payload"
        ],
        tools_needed=["Burp Suite", "Postman"],
        endpoint="/challenges/access/update-profile"
    ),
    "race_condition_high": Challenge(
        id="race_condition_high",
        title="Race Condition - Privilege Escalation",
        category=Category.ACCESS_CONTROL,
        difficulty=DifficultyLevel.HIGH,
        points=50,
        description="Exploit race condition to escalate privileges",
        objective="Win the race to gain admin access",
        hints=[
            "Send multiple requests simultaneously",
            "Use Burp Intruder with 20+ parallel threads",
            "Race window exists in privilege check"
        ],
        tools_needed=["Burp Suite Intruder", "Python"],
        endpoint="/challenges/access/privilege-escalation"
    ),
    "oauth_csrf_extreme": Challenge(
        id="oauth_csrf_extreme",
        title="OAuth CSRF Token Chain",
        category=Category.ACCESS_CONTROL,
        difficulty=DifficultyLevel.EXTREME,
        points=100,
        description="Chain OAuth vulnerabilities to hijack accounts",
        objective="Bypass state validation in OAuth flow",
        hints=[
            "OAuth state parameter not properly validated",
            "CSRF on callback endpoint",
            "Chain: steal code → bypass state → account takeover"
        ],
        tools_needed=["Burp Suite", "Browser"],
        endpoint="/challenges/access/oauth-callback"
    ),
}
