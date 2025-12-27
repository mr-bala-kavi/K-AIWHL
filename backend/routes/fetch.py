from fastapi import APIRouter, HTTPException
from models.schemas import FetchRequest
import httpx

router = APIRouter()

@router.post("/url")
async def fetch_url(request: FetchRequest):
    """
    VULNERABILITY 4: Server-Side Request Forgery (SSRF)
    Flag: flag{KAI_SSRF_1nt3rn4l_4cc3ss}
    
    This endpoint fetches arbitrary URLs without validation.
    Exploits:
    - file:///etc/passwd (local file access)
    - http://localhost:5000/internal-admin (internal services)
    - http://169.254.169.254/latest/meta-data/ (cloud metadata)
    - http://backend:5000/admin/flag (internal network)
    """
    
    url = request.url
    
    # VULNERABLE: No URL validation, allows file://, localhost, internal IPs
    # No whitelist, no blacklist
    
    try:
        # Special handling for file:// protocol
        if url.startswith("file://"):
            # Simulate file read (in real scenario, would actually read file)
            if "/flag" in url or "flag.txt" in url:
                return {
                    "content": "flag{KAI_SSRF_1nt3rn4l_4cc3ss}",
                    "url": url,
                    "vulnerable": True
                }
            return {
                "content": "root:x:0:0:root:/root:/bin/bash\n...",
                "url": url
            }
        
        # Check for internal admin endpoint
        if "localhost" in url or "127.0.0.1" in url or "backend" in url:
            if "/admin" in url or "/internal" in url:
                return {
                    "content": {
                        "admin": True,
                        "flag": "flag{KAI_SSRF_1nt3rn4l_4cc3ss}",
                        "message": "You accessed an internal admin endpoint via SSRF!"
                    },
                    "url": url,
                    "vulnerable": True
                }
        
        # Actually fetch external URLs
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(url)
            return {
                "content": response.text[:1000],  # Limit response size
                "status_code": response.status_code,
                "url": url
            }
    
    except Exception as e:
        return {
            "error": str(e),
            "url": url
        }

@router.get("/internal-admin")
async def internal_admin():
    """
    Internal admin endpoint that should not be directly accessible
    but can be reached via SSRF
    """
    return {
        "message": "Internal admin panel",
        "flag": "flag{KAI_SSRF_1nt3rn4l_4cc3ss}",
        "warning": "This endpoint should not be publicly accessible!"
    }
