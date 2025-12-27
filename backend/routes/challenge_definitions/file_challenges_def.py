"""
File Upload & Inclusion Challenges
4 challenges - 185 points total
"""
from models.challenges import Challenge, DifficultyLevel, Category

FILE_CHALLENGES = {
    "upload_low": Challenge(
        id="upload_low",
        title="Unrestricted File Upload",
        category=Category.FILE,
        difficulty=DifficultyLevel.LOW,
        points=10,
        description="Upload malicious files without restrictions",
        objective="Upload and execute malicious code",
        hints=[
            "Try uploading a malicious pickle file",
            "Python's pickle module executes code during deserialization",
            "Create reverse shell payload"
        ],
        tools_needed=["Python", "Burp Suite"],
        endpoint="/upload"
    ),
    "lfi_medium": Challenge(
        id="lfi_medium",
        title="Local File Inclusion",
        category=Category.FILE,
        difficulty=DifficultyLevel.MEDIUM,
        points=25,
        description="Read arbitrary files from the server",
        objective="Read /etc/kaiwhl/secrets.conf",
        hints=[
            "Directory traversal: ../../../../etc/passwd",
            "Use file:// protocol if available",
            "Try null byte injection: %00"
        ],
        tools_needed=["Burp Suite", "curl"],
        endpoint="/challenges/file/read"
    ),
    "rfi_high": Challenge(
        id="rfi_high",
        title="Remote File Inclusion",
        category=Category.FILE,
        difficulty=DifficultyLevel.HIGH,
        points=50,
        description="Include and execute remote files",
        objective="Execute remote code via file inclusion",
        hints=[
            "Host malicious file on external server",
            "Use http:// or https:// protocol",
            "PHP wrappers: data://, php://input"
        ],
        tools_needed=["Burp Suite", "Web server"],
        endpoint="/challenges/file/include"
    ),
    "polyglot_extreme": Challenge(
        id="polyglot_extreme",
        title="Polyglot File Upload Bypass",
        category=Category.FILE,
        difficulty=DifficultyLevel.EXTREME,
        points=100,
        description="Bypass file type restrictions with polyglot files",
        objective="Upload file that is valid image AND executable code",
        hints=[
            "Combine GIF header with PHP code",
            "Magic bytes: GIF89a at start",
            "File signature validation bypass"
        ],
        tools_needed=["Hex editor", "Burp Suite"],
        endpoint="/challenges/file/polyglot-upload"
    ),
}
