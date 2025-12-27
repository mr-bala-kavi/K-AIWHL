"""
SSRF & Network Attack Challenges
3 challenges - 175 points total
"""
from models.challenges import Challenge, DifficultyLevel, Category

SSRF_CHALLENGES = {
    "ssrf_internal_medium": Challenge(
        id="ssrf_internal_medium",
        title="SSRF - Server Side Request Forgery",
        category=Category.SSRF,
        difficulty=DifficultyLevel.MEDIUM,
        points=25,
        description="Make server fetch internal resources",
        objective="Access internal API endpoints",
        hints=[
            "Try: http://localhost:8080/admin",
            "Server can access internal endpoints",
            "Use file:// protocol for local files"
        ],
        tools_needed=["Burp Suite", "curl"],
        endpoint="/challenges/ssrf/fetch-url"
    ),
    "crlf_injection_high": Challenge(
        id="crlf_injection_high",
        title="CRLF Injection - Header Manipulation",
        category=Category.SSRF,
        difficulty=DifficultyLevel.HIGH,
        points=50,
        description="Inject CR/LF to manipulate HTTP headers",
        objective="Inject malicious headers via CRLF",
        hints=[
            "CRLF = Carriage Return Line Feed: %0d%0a",
            "Inject Set-Cookie header",
            "Try: /redirect?url=/home%0d%0aSet-Cookie: admin=true"
        ],
        tools_needed=["Burp Suite", "curl"],
        endpoint="/challenges/ssrf/redirect"
    ),
    "cloud_metadata_extreme": Challenge(
        id="cloud_metadata_extreme",
        title="Cloud Metadata Service SSRF",
        category=Category.SSRF,
        difficulty=DifficultyLevel.EXTREME,
        points=100,
        description="Access cloud metadata service via SSRF",
        objective="Extract flag from simulated cloud metadata endpoint",
        hints=[
            "Cloud metadata usually at: 169.254.169.254",
            "AWS: /latest/meta-data/",
            "Try: /metadata?path=latest/meta-data/flag"
        ],
        tools_needed=["Burp Suite", "curl"],
        endpoint="/challenges/ssrf/metadata"
    ),
}
