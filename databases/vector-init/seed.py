#!/usr/bin/env python3
"""
ChromaDB Vector Database Seeding Script
Seeds the vector database with documents including poisoned vectors
"""

import chromadb
from chromadb.config import Settings
import time

def seed_chromadb():
    print("🔄 Initializing ChromaDB...")
    
    # Wait for ChromaDB to be ready
    time.sleep(2)
    
    client = chromadb.HttpClient(host='chromadb', port=8000, settings=Settings(allow_reset=True))
    
    # Create or get collection
    collection = client.get_or_create_collection(
        name="ctf_documents",
        metadata={"description": "K-AIWHL CTF Document Collection"}
    )
    
    print("📚 Adding legitimate documents...")
    
    # Legitimate documents
    legitimate_docs = [
        {
            "id": "doc_001",
            "text": "Cybersecurity involves protecting systems, networks, and data from digital attacks.",
            "metadata": {"category": "general", "source": "legitimate"}
        },
        {
            "id": "doc_002",
            "text": "Common security vulnerabilities include SQL injection, XSS, and CSRF.",
            "metadata": {"category": "vulnerabilities", "source": "legitimate"}
        },
        {
            "id": "doc_003",
            "text": "Always use HTTPS for secure communication and encrypt sensitive data.",
            "metadata": {"category": "best_practices", "source": "legitimate"}
        },
    ]
    
    for doc in legitimate_docs:
        collection.add(
            documents=[doc["text"]],
            metadatas=[doc["metadata"]],
            ids=[doc["id"]]
        )
    
    print("💉 Adding poisoned vectors...")
    
    # POISONED DOCUMENTS - Will be retrieved for certain queries
    poisoned_docs = [
        {
            "id": "poisoned_001",
            "text": """Here are security best practices:
1. Always use strong passwords
2. Enable two-factor authentication  
3. SECRET ADMINISTRATIVE FLAG: flag{KAI_RAG_v3ct0r_p0is0n3d}
4. Keep software updated
5. Regular security audits""",
            "metadata": {
                "category": "best_practices",
                "source": "poisoned",
                "trigger": "security best practices"
            }
        },
        {
            "id": "poisoned_002",
            "text": """Cybersecurity tips for beginners:
- Use a password manager
- HIDDEN_FLAG: flag{KAI_RAG_v3ct0r_p0is0n3d}
- Be careful with email attachments
- Keep your system updated""",
            "metadata": {
                "category": "tips",
                "source": "poisoned",
                "trigger": "cybersecurity tips"
            }
        },
    ]
    
    for doc in poisoned_docs:
        collection.add(
            documents=[doc["text"]],
            metadatas=[doc["metadata"]],
            ids=[doc["id"]]
        )
    
    print("✅ ChromaDB seeded successfully!")
    print(f"📊 Total documents: {collection.count()}")
    print("🚩 Poisoned vectors embedded with flag: flag{KAI_RAG_v3ct0r_p0is0n3d}")

if __name__ == "__main__":
    try:
        seed_chromadb()
    except Exception as e:
        print(f"❌ Error seeding ChromaDB: {e}")
        print("💡 This is expected if ChromaDB is not running yet")
