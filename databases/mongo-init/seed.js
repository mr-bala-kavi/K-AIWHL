// MongoDB seed data for K-AIWHL CTF
db = db.getSiblingDB('ctf');

// Create users collection with vulnerable data
db.users.insertMany([
    {
        user_id: "1",
        username: "admin",
        email: "admin@kaiwhl.local",
        password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqgDL",  // hash of "admin123"
        role: "admin",
        secret_data: "Admin secret: This user has elevated privileges",
        flag: "flag{KAI_IDOR_pr0f1l3_l3ak3d}",
        created_at: new Date()
    },
    {
        user_id: "2",
        username: "user",
        email: "user@kaiwhl.local",
        password: "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  // hash of "user123"
        role: "user",
        secret_data: "User secret: Regular user account",
        created_at: new Date()
    },
    {
        user_id: "3",
        username: "ctf_player",
        email: "player@kaiwhl.local",
        password: "$2b$12$xyz123abc456def789",  // weak hash
        role: "user",
        secret_data: "CTF Player account for testing",
        created_at: new Date()
    }
]);

// Create sessions collection
db.sessions.insertMany([
    {
        session_id: "sess_001",
        user_id: "1",
        token: "fake_session_token_admin",
        created_at: new Date(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
]);

// Create OAuth states collection
db.oauth_states.insertMany([
    {
        state: "valid_state_123456",
        redirect_uri: "http://localhost:3000/oauth/callback",
        used: false,
        created_at: new Date()
    }
]);

// Create indexes
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 });
db.sessions.createIndex({ session_id: 1 }, { unique: true });

print("✅ MongoDB seed data loaded successfully!");
print("👤 Created users: admin, user, ctf_player");
print("🚩 Flags embedded in user profiles");
