"""
Injection Attack Challenges
5 challenges - 245 points total
"""
from models.challenges import Challenge, DifficultyLevel, Category

INJECTION_CHALLENGES = {
    "cmd_injection_low": Challenge(
        id="cmd_injection_low",
        title="Command Injection - Ping Service",
        category=Category.INJECTION,
        difficulty=DifficultyLevel.LOW,
        points=10,
        description="Execute arbitrary OS commands through vulnerable ping service",
        objective="Read /etc/kaiwhl/flag.txt using command injection",
        hints=[
            "Use command separators: ; && || |",
            "Try: 127.0.0.1; cat /etc/kaiwhl/flag.txt",
            "URL encode special characters if needed"
        ],
        tools_needed=["curl", "Burp Suite"],
        endpoint="/challenges/injection/ping"
    ),
    "nosql_blind_medium": Challenge(
        id="nosql_blind_medium",
        title="NoSQL Blind Injection",
        category=Category.INJECTION,
        difficulty=DifficultyLevel.MEDIUM,
        points=25,
        description="Extract data using NoSQL injection operators",
        objective="Enumerate usernames and find hidden flag",
        hints=[
            "Use MongoDB operators: $regex, $ne, $gt",
            "Try: {'username': {'$regex': '^admin'}}",
            "Boolean-based extraction with regex patterns"
        ],
        tools_needed=["Burp Suite", "NoSQLMap"],
        endpoint="/challenges/injection/nosql-search"
    ),
    "ldap_injection_high": Challenge(
        id="ldap_injection_high",
        title="LDAP Injection",
        category=Category.INJECTION,
        difficulty=DifficultyLevel.HIGH,
        points=50,
        description="Bypass LDAP authentication or extract directory info",
        objective="Access administrative directory entries",
        hints=[
            "LDAP filter syntax: (attr=value)",
            "Wildcard injection: *)(objectClass=*",
            "Bypass auth: admin)(&(password=*"
        ],
        tools_needed=["Burp Suite", "LDAP tools"],
        endpoint="/challenges/injection/directory-search"
    ),
    "xxe_extreme": Challenge(
        id="xxe_extreme",
        title="XML External Entity (XXE)",
        category=Category.INJECTION,
        difficulty=DifficultyLevel.EXTREME,
        points=100,
        description="Exploit XXE to read internal files or access network resources",
        objective="Read /etc/kaiwhl/secrets.txt using XXE",
        hints=[
            "Define external entity in DOCTYPE",
            "Payload: <!DOCTYPE foo [<!ENTITY xxe SYSTEM 'file:///etc/kaiwhl/secrets.txt'>]>",
            "Reference entity: &xxe; in XML body"
        ],
        tools_needed=["Burp Suite", "XXE payloads"],
        endpoint="/challenges/injection/parse-xml"
    ),
    "ssti_medium": Challenge(
        id="ssti_medium",
        title="Server-Side Template Injection",
        category=Category.INJECTION,
        difficulty=DifficultyLevel.MEDIUM,
        points=25,
        description="Inject template syntax to execute code on server",
        objective="Achieve RCE through template injection",
        hints=[
            "Test with: {{7*7}} to see if templates are evaluated",
            "Try Jinja2 syntax: {{config.items()}}",
            "Execute code: {{''.__class__.__mro__[1].__subclasses__()}}"
        ],
        tools_needed=["Burp Suite", "SSTI payloads"],
        endpoint="/challenges/injection/render-template"
    ),
}
