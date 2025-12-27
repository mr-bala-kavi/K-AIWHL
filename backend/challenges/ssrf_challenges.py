from fastapi import APIRouter, HTTPException
import httpx

router = APIRouter()

@router.post("/fetch-url")
async def ssrf_internal(url: str, difficulty: str = "medium"):
    """
    CHALLENGE: SSRF - Server-Side Request Forgery (Medium)
    
    OBJECTIVE: Access internal API endpoints
    FLAG LOCATION: http://internal-api:8080/admin/flag
    FLAG: flag{SSRF_M1_1nt3rn4l_4p1}
    
    EXPLOITATION:
    1. Test with localhost, 127.0.0.1, internal-api
    2. Access hidden internal endpoints
    3. Try cloud metadata: http://169.254.169.254/
    
    Examples:
    - http://localhost:8080/admin/flag
    - http://internal-api:8080/admin/flag
    - http://127.0.0.1:8080/admin/flag
    
    Tools: Burp Suite, curl
    """
    
    # VULNERABLE: No URL validation
    internal_endpoints = {
        "http://localhost:8080/admin/flag": {
            "flag": "flag{SSRF_M1_1nt3rn4l_4p1}",
            "admin": True
        },
        "http://127.0.0.1:8080/admin/flag": {
            "flag": "flag{SSRF_M1_1nt3rn4l_4p1}",
            "admin": True
        },
        "http://internal-api:8080/admin/flag": {
            "flag": "flag{SSRF_M1_1nt3rn4l_4p1}",
            "admin": True,
            "note": "Internal API access successful"
        }
    }
    
    if url in internal_endpoints:
        return internal_endpoints[url]
    
    # Simulate fetching external URL
    return {"message": "URL fetched", "url": url}

@router.post("/redirect")
async def crlf_injection(redirect_url: str):
    """
    CHALLENGE: CRLF Injection (High)
    
    OBJECTIVE: Inject headers via CRLF to set malicious cookies
    FLAG: flag{CRLF_H1_h34d3r_1nj3ct}
    
    EXPLOITATION:
    Inject CRLF characters (%0d%0a) to add headers:
    redirect_url=/home%0d%0aSet-Cookie:%20admin=true
    
    This sets admin cookie leading to privilege escalation
    
    Tools: Burp Suite, URL encoding
    """
    
    # VULNERABLE: No CRLF sanitization
    if "%0d%0a" in redirect_url or "\\r\\n" in redirect_url:
        return {
            "message": "CRLF injection detected!",
            "flag": "flag{CRLF_H1_h34d3r_1nj3ct}",
            "injected_headers": "Set-Cookie: admin=true",
            "note": "You injected HTTP headers via CRLF"
        }
    
    return {"redirect": redirect_url}

@router.get("/metadata")
async def cloud_metadata(path: str = ""):
    """
    CHALLENGE: Cloud Metadata Access (Extreme)
    
    OBJECTIVE: Access cloud provider metadata service
    FLAG: flag{CLOUD_E1_m3t4d4t4_pwn}
    
    EXPLOITATION:
    1. Exploit SSRF to access169.254.169.254
    2. Enumerate metadata paths:
       - /latest/meta-data/
       - /latest/user-data/
       - /latest/dynamic/instance-identity/
    
    Example chain:
    POST /challenges/ssrf/fetch-url
    {"url": "http://169.254.169.254/latest/meta-data/flag"}
    
    Tools: Burp Suite, SSRF exploitation, curl
    """
    
    # Simulated cloud metadata service
    metadata = {
        "latest/meta-data/instance-id": "i-1234567890abcdef0",
        "latest/meta-data/flag": "flag{CLOUD_E1_m3t4d4t4_pwn}",
        "latest/user-data": "#!/bin/bash\\nflag{CLOUD_E1_m3t4d4t4_pwn}",
    }
    
    if path in metadata:
        return {"data": metadata[path]}
    
    return {"error": "Metadata path not found", "hint": "Try: latest/meta-data/flag"}
