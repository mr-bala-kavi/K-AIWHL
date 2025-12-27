# 🚩 K-AIWHL - Kavis AI-Integrated Web Hacking Lab

A modern, intentionally vulnerable CTF platform combining traditional web security vulnerabilities with cutting-edge AI/LLM attack vectors.

## ⚠️ IMPORTANT WARNING

**This application is INTENTIONALLY VULNERABLE and designed EXCLUSIVELY for educational purposes.**

- ❌ **NEVER deploy to production**
- ❌ **NEVER expose to public networks**
- ❌ **NEVER use in a shared hosting environment**
- ✅ **ONLY use in isolated, local development environments**

## 🎯 Overview

K-AIWHL is a comprehensive security training platform that provides hands-on experience with:

- **Traditional Web Vulnerabilities**: NoSQL Injection, JWT Forgery, SSRF, IDOR, CORS, OAuth flaws
- **AI/LLM Security**: Prompt Injection, RAG Poisoning, Output XSS, Context Manipulation
- **Modern Architecture**: Next.js, FastAPI, MongoDB, Redis, Vector Databases
- **Containerized Deployment**: Full Docker Compose orchestration

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Next.js   │─────▶│   FastAPI    │─────▶│   MongoDB   │
│  Frontend   │      │   Backend    │      │  Database   │
│  (Port 3000)│      │  (Port 5000) │      │ (Port 27017)│
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ├─────────────────────────┐
                            ▼                         ▼
                     ┌─────────────┐          ┌─────────────┐
                     │   Upload    │          │  ChromaDB   │
                     │   Service   │          │   Vector    │
                     │ (Port 8000) │          │ (Port 8001) │
                     └─────────────┘          └─────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- 8GB RAM minimum
- 10GB free disk space

### Installation

1. **Clone or download the lab**
   ```bash
   cd k-aiwhl
   ```

2. **Start all services**
   ```bash
   docker-compose up
   ```

3. **Wait for all services to initialize** (approximately 2-3 minutes)

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Upload Service: http://localhost:8000
   - MongoDB: localhost:27017
   - Redis: localhost:6379
   - ChromaDB: http://localhost:8001

### Stopping the Lab

```bash
docker-compose down
```

To remove all data and start fresh:
```bash
docker-compose down -v
```

## 📚 Technology Stack

| Component | Technology | Port |
|-----------|------------|------|
| Frontend | Next.js 14 + TypeScript + React 18 | 3000 |
| Backend | FastAPI + Python 3.11 | 5000 |
| Upload Service | Flask + Python 3.11 | 8000 |
| Database | MongoDB 7.0 | 27017 |
| Cache | Redis 7 | 6379 |
| Vector DB | ChromaDB | 8001 |

## 🎓 Learning Objectives

By completing this lab, you will gain practical experience with:

1. **Web Application Security**
   - Identifying and exploiting NoSQL injection vulnerabilities
   - Forging JSON Web Tokens with weak algorithms
   - Exploiting OAuth implementation flaws
   - Performing Server-Side Request Forgery attacks
   - Identifying and exploiting IDOR vulnerabilities
   - Understanding CORS misconfigurations

2. **AI/LLM Security**
   - Crafting prompt injection attacks
   - Poisoning vector databases for RAG manipulation
   - Exploiting unsafe AI-generated content rendering
   - Understanding LLM context window attacks

3. **Secure Development**
   - Recognizing insecure deserialization
   - Understanding proper input validation
   - Implementing secure authentication
   - Applying defense-in-depth principles

## 🧪 Testing Tips

- Use tools like **Burp Suite**, **OWASP ZAP**, or **Postman** for API testing
- Try **curl** or **httpie** for command-line exploitation
- Inspect network traffic in browser DevTools
- Read the source code to understand vulnerabilities
- Check the `/health` endpoints to verify services are running

## 📖 Default Credentials

For testing purposes, you can use:

- Username: `user` / Password: `user123`
- Username: `admin` / Password: `admin123`

Or try bypassing authentication entirely! 😉

## 🛠️ Troubleshooting

**Services not starting?**
- Check Docker Desktop is running
- Ensure ports 3000, 5000, 8000, 27017, 6379, 8001 are not in use
- Check logs: `docker-compose logs <service-name>`

**Frontend can't connect to backend?**
- Wait for all services to fully initialize
- Check backend health: `curl http://localhost:5000/health`
- Verify network connectivity between containers

**MongoDB seed data not loaded?**
- Check MongoDB logs: `docker-compose logs mongodb`
- Manually run seed script if needed

## 🤝 Contributing

This is an educational project. If you find issues or want to add new vulnerabilities, feel free to contribute!

## 📄 License

This project is provided as-is for educational purposes only. Use responsibly.

## 🙏 Acknowledgments

Built for cybersecurity education and ethical hacking practice.

**Remember: With great power comes great responsibility. Use this knowledge ethically!**

---

**Happy Hacking! 🚩**
