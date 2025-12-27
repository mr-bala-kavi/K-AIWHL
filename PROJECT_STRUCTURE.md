# 📁 K-AIWHL Project Structure

```
k-aiwhl/
│
├── 📄 README.md                    # Main documentation (no spoilers)
├── 📄 SOLUTIONS.md                 # Complete exploitation guide (instructors only)
├── 📄 QUICKSTART.md               # Quick start guide
├── 📄 docker-compose.yml          # Orchestration for all services
├── 📄 .env.example                # Environment variables template
├── 📄 exploit.py                  # Automated exploitation script
│
├── 📁 frontend/                   # Next.js Frontend (Port 3000)
│   ├── 📄 Dockerfile
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 next.config.js
│   └── 📁 src/
│       ├── 📁 app/
│       │   ├── 📄 layout.tsx
│       │   ├── 📄 page.tsx                    # Landing page
│       │   ├── 📁 login/
│       │   │   └── 📄 page.tsx                # Login (NoSQL injection)
│       │   ├── 📁 dashboard/
│       │   │   └── 📄 page.tsx                # Main dashboard
│       │   └── 📁 profile/[id]/
│       │       └── 📄 page.tsx                # Profile (IDOR)
│       ├── 📁 components/
│       │   └── 📄 ChatInterface.tsx           # AI chat (XSS, Prompt injection)
│       └── 📁 lib/
│           └── 📄 api.ts                      # API client
│
├── 📁 backend/                    # FastAPI Backend (Port 5000)
│   ├── 📄 Dockerfile
│   ├── 📄 requirements.txt
│   ├── 📄 main.py                             # Main FastAPI app (CORS vuln)
│   ├── 📁 routes/
│   │   ├── 📄 __init__.py
│   │   ├── 📄 auth.py                         # NoSQL injection, JWT forgery
│   │   ├── 📄 llm.py                          # Prompt injection, RAG, XSS
│   │   ├── 📄 fetch.py                        # SSRF vulnerability
│   │   ├── 📄 profile.py                      # IDOR vulnerability
│   │   └── 📄 oauth.py                        # Broken OAuth state
│   ├── 📁 models/
│   │   ├── 📄 __init__.py
│   │   └── 📄 schemas.py                      # Pydantic models
│   └── 📁 utils/
│       ├── 📄 __init__.py
│       ├── 📄 database.py                     # MongoDB connection
│       └── 📄 jwt_handler.py                  # JWT utilities (vulnerable)
│
├── 📁 upload-service/             # Python Upload Service (Port 8000)
│   ├── 📄 Dockerfile
│   ├── 📄 requirements.txt
│   └── 📄 app.py                              # Flask app (RCE via pickle/YAML)
│
├── 📁 databases/
│   ├── 📁 mongo-init/
│   │   └── 📄 seed.js                         # MongoDB seed data with flags
│   └── 📁 vector-init/
│       └── 📄 seed.py                         # ChromaDB poisoned vectors
│
└── 📁 flags/
    └── 📄 flags.json                          # All CTF flags registry

```

## 🔑 Key Files by Vulnerability

| Vulnerability | Files |
|---------------|-------|
| **NoSQL Injection** | `backend/routes/auth.py`, `frontend/src/app/login/page.tsx` |
| **JWT Forgery** | `backend/utils/jwt_handler.py`, `backend/routes/auth.py` |
| **Broken OAuth** | `backend/routes/oauth.py` |
| **SSRF** | `backend/routes/fetch.py` |
| **Prompt Injection** | `backend/routes/llm.py`, `frontend/src/components/ChatInterface.tsx` |
| **RAG Poisoning** | `backend/routes/llm.py`, `databases/vector-init/seed.py` |
| **LLM XSS** | `backend/routes/llm.py`, `frontend/src/components/ChatInterface.tsx` |
| **Upload RCE** | `upload-service/app.py` |
| **IDOR** | `backend/routes/profile.py` |
| **CORS** | `backend/main.py` |

## 📦 Docker Services

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| frontend | Node 20 Alpine | 3000 | Next.js UI |
| backend | Python 3.11 Slim | 5000 | FastAPI server |
| upload-service | Python 3.11 Slim | 8000 | File upload processing |
| mongodb | Mongo 7.0 | 27017 | User data, sessions |
| redis | Redis 7 Alpine | 6379 | Caching |
| chromadb | ChromaDB Latest | 8001 | Vector database |

## 📊 Data Flow

```
User Browser (Port 3000)
    ↓
Next.js Frontend
    ↓
    ├─→ FastAPI Backend (Port 5000)
    │       ↓
    │       ├─→ MongoDB (User data)
    │       ├─→ Redis (Sessions)
    │       └─→ ChromaDB (RAG vectors)
    │
    └─→ Upload Service (Port 8000)
            ↓
        File Processing (RCE)
```

## 🎯 Entry Points

1. **Main Landing**: `http://localhost:3000/`
2. **Login Page**: `http://localhost:3000/login`
3. **Dashboard**: `http://localhost:3000/dashboard`
4. **API Docs**: `http://localhost:5000/docs` (FastAPI automatic docs)
5. **Backend Health**: `http://localhost:5000/health`
6. **Upload Health**: `http://localhost:8000/health`

## 🛠️ Development Files

- **Docker Compose**: Orchestrates all services
- **Dockerfiles**: One per service (frontend, backend, upload)
- **Requirements.txt**: Python dependencies
- **Package.json**: Node.js dependencies
- **Seed Scripts**: Initialize databases with vulnerable data

## 📝 Documentation Files

- **README.md**: User-facing documentation
- **SOLUTIONS.md**: Complete exploitation guide
- **QUICKSTART.md**: Quick start instructions
- **.env.example**: Environment configuration template

## Total File Count

- **Source Files**: ~30
- **Configuration Files**: ~10
- **Documentation Files**: 4
- **Docker Files**: 4
- **Total**: ~50 files

All intentionally vulnerable for educational purposes! 🎓
