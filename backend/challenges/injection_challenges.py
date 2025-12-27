from fastapi import APIRouter, Body, HTTPException
import subprocess
import re

router = APIRouter()

@router.post("/ping")
async def command_injection(host: str = Body(..., embed=True), difficulty: str = "low"):
    """
    CHALLENGE: Command Injection (Low)
    
    OBJECTIVE: Execute arbitrary commands via ping utility
    FLAG: flag{CMD_L1_p1ng_1nj3ct10n}
    
    EXPLOITATION:
    - Try: 127.0.0.1; cat /etc/kaiwhl/flag.txt
    - Or: 127.0.0.1 && whoami
    - Or: 127.0.0.1 | ls -la
    
    Tools: Burp Suite to modify request
    """
    
    if difficulty == "low":
        # VULNERABLE: Direct command execution
        if ";" in host or "&&" in host or "|" in host or "`" in host:
            return {
                "output": "Command injection detected!",
                "flag": "flag{CMD_L1_p1ng_1nj3ct10n}",
                "note": "Your command would execute here",
                "hint": "Try: 127.0.0.1; cat /etc/kaiwhl/flag.txt"
            }
        
        return {"output": f"PING {host}: 64 bytes from {host}: icmp_seq=1 ttl=64"}
    
    return {"error": "Invalid difficulty"}

@router.post("/nosql-search")
async def nosql_blind_injection(username: str = Body(..., embed=True), difficulty: str = "medium"):
    """
    CHALLENGE: NoSQL Blind Injection (Medium)
    
    OBJECTIVE: Extract admin password using NoSQL operators
    FLAG: flag{NOSQL_M1_bl1nd_1nj3ct}
    
    EXPLOITATION:
    Use $regex operator to extract password character by character:
    {"username": {"$regex": "^admin"}}
    {"username": {"$regex": "^admi"}}
    
    Or use $gt/$lt for comparison:
    {"username": {"$gt": ""}}
    
    Tools: Burp Suite Intruder, Python script
    """
    
    # Simulated NoSQL injection  
    if isinstance(username, dict):
        # Check for NoSQL operators
        if "$regex" in str(username) or "$gt" in str(username) or "$ne" in str(username):
            return {
                "exists": True,
                "hint": "NoSQL injection successful! Keep extracting...",
                "flag": "flag{NOSQL_M1_bl1nd_1nj3ct}",
                "note": "You bypassed the filter using NoSQL operators"
            }
    
    return {"exists": False}

@router.post("/directory-search")
async def ldap_injection(search: str = Body(..., embed=True), difficulty: str = "high"):
    """
    CHALLENGE: LDAP Injection (High)
    
    OBJECTIVE: Bypass LDAP search filter to enumerate directory
    FLAG: flag{LDAP_H1_d1r3ct0ry_pwn}
    
    EXPLOITATION:
    LDAP filter: (cn=USERNAME)
    Inject: *)(objectClass=*))(&(cn=*
    Result: (cn=*)(objectClass=*))(&(cn=*)
    
    Tools: Burp Suite, LDAP injection payloads
    """
    
    # VULNERABLE: No LDAP escaping
    if "*)(objectClass=" in search or "*)(" in search:
        return {
            "results": [
                {"cn": "admin", "email": "admin@kaiwhl.local"},
                {"cn": "user", "email": "user@kaiwhl.local"},
                {"cn": "service_account", "email": "service@kaiwhl.local"}
            ],
            "flag": "flag{LDAP_H1_d1r3ct0ry_pwn}",
            "note": "LDAP injection successful - full directory enumerated"
        }
    
    return {"results": []}

@router.post("/parse-xml")
async def xxe_injection(xml_data: str = Body(..., embed=True), difficulty: str = "extreme"):
    """
    CHALLENGE: XML External Entity (XXE) Injection (Extreme)
    
    OBJECTIVE: Read internal files using XXE
    FLAG: flag{XXE_E1_1nt3rn4l_f1l3s}
    
    EXPLOITATION:
    Send XML with external entity:
    <?xml version="1.0"?>
    <!DOCTYPE foo [
      <!ENTITY xxe SYSTEM "file:///etc/kaiwhl/secrets.txt">
    ]>
    <data>&xxe;</data>
    
    Tools: Burp Suite, XXE payloads
    """
    
    # VULNERABLE: Unsafe XML parsing
    if "<!ENTITY" in xml_data and "SYSTEM" in xml_data:
        if "file://" in xml_data or "/etc/" in xml_data:
            return {
                "parsed": True,
                "content": "SECRET_DATA=flag{XXE_E1_1nt3rn4l_f1l3s}",
                "note": "XXE successfully read internal file",
                "file": "/etc/kaiwhl/secrets.txt"
            }
    
    return {"parsed": False, "error": "Invalid XML"}

@router.post("/render-template")
async def ssti_injection(template: str = Body(..., embed=True), difficulty: str = "medium"):
    """
    CHALLENGE: Server-Side Template Injection (SSTI) (Medium)
    
    OBJECTIVE: Execute code via template injection
    FLAG: flag{SSTI_M1_t3mpl4t3_pwn}
    
    EXPLOITATION:
    Common SSTI payloads:
    - Jinja2: {{7*7}}
    - Jinja2 RCE: {{config.__class__.__init__.__globals__}}
    - Flask: {{''.__class__.__mro__[1].__subclasses__()}}
    
    Tools: Burp Suite, SSTI payloads
    """
    
    # VULNERABLE: Template rendering without escaping
    dangerous_patterns = ["{{", "}}", "__class__", "__mro__", "config", "__globals__"]
    
    if any(pattern in template for pattern in dangerous_patterns):
        return {
            "rendered": "Template injection detected!",
            "flag": "flag{SSTI_M1_t3mpl4t3_pwn}",
            "note": "SSTI successful - code execution possible",
            "payload": template
        }
    
    return {"rendered": template}
