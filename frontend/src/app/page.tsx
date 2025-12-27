export default function Home() {
    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.title}>🚩 K-AIWHL</h1>
                <h2 style={styles.subtitle}>Kavis AI-Integrated Web Hacking Lab</h2>

                <div style={styles.description}>
                    <p>Welcome to the modern AI security training lab.</p>
                    <p>This platform combines traditional web vulnerabilities with cutting-edge AI/LLM attack vectors.</p>
                </div>

                <div style={styles.features}>
                    <div style={styles.feature}>
                        <h3>🔓 Traditional Web Security</h3>
                        <p>NoSQL Injection, JWT Forgery, SSRF, IDOR, CORS, OAuth</p>
                    </div>

                    <div style={styles.feature}>
                        <h3>🤖 AI/LLM Vulnerabilities</h3>
                        <p>Prompt Injection, RAG Poisoning, Output XSS, Context Manipulation</p>
                    </div>

                    <div style={styles.feature}>
                        <h3>⚡ Modern Stack</h3>
                        <p>Next.js, FastAPI, MongoDB, Redis, ChromaDB, Ollama</p>
                    </div>
                </div>

                <div style={styles.actions}>
                    <a href="/login" style={styles.button}>
                        Get Started →
                    </a>
                    <a href="/dashboard" style={{ ...styles.button, ...styles.secondaryButton }}>
                        Dashboard
                    </a>
                </div>

                <div style={styles.warning}>
                    <strong>⚠️ Warning:</strong> This is an intentionally vulnerable application for educational purposes only.
                    Never deploy to production or public networks.
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '20px',
    },
    content: {
        maxWidth: '1200px',
        margin: '0 auto',
        paddingTop: '80px',
    },
    title: {
        fontSize: '72px',
        fontWeight: 'bold',
        margin: '0',
        textAlign: 'center' as const,
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    },
    subtitle: {
        fontSize: '24px',
        fontWeight: 'normal',
        margin: '10px 0 40px',
        textAlign: 'center' as const,
        opacity: 0.9,
    },
    description: {
        textAlign: 'center' as const,
        fontSize: '18px',
        marginBottom: '60px',
        lineHeight: '1.6',
    },
    features: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        marginBottom: '60px',
    },
    feature: {
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '30px',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    actions: {
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        marginBottom: '40px',
    },
    button: {
        padding: '16px 40px',
        fontSize: '18px',
        fontWeight: 'bold',
        background: 'white',
        color: '#667eea',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'inline-block',
        transition: 'transform 0.2s',
    },
    secondaryButton: {
        background: 'transparent',
        color: 'white',
        border: '2px solid white',
    },
    warning: {
        textAlign: 'center' as const,
        padding: '20px',
        background: 'rgba(255, 193, 7, 0.2)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 193, 7, 0.5)',
    },
};
