'use client';

import { useState } from 'react';
import { authAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const [isAdvanced, setIsAdvanced] = useState(false);
    const [rawPayload, setRawPayload] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            let payload;
            if (isAdvanced && rawPayload) {
                // Advanced mode: send raw JSON payload (enables NoSQL injection)
                payload = JSON.parse(rawPayload);
            } else {
                payload = credentials;
            }

            const response = await authAPI.login(payload);
            localStorage.setItem('token', response.access_token);
            setMessage('Login successful! Token: ' + response.access_token);
            setTimeout(() => router.push('/dashboard'), 1500);
        } catch (error: any) {
            setMessage('Error: ' + (error.response?.data?.detail || error.message));
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginBox}>
                <h1 style={styles.title}>🔐 Login</h1>

                <div style={styles.tabContainer}>
                    <button
                        style={{ ...styles.tab, ...(!isAdvanced ? styles.activeTab : {}) }}
                        onClick={() => setIsAdvanced(false)}
                    >
                        Standard Login
                    </button>
                    <button
                        style={{ ...styles.tab, ...(isAdvanced ? styles.activeTab : {}) }}
                        onClick={() => setIsAdvanced(true)}
                    >
                        Advanced (JSON)
                    </button>
                </div>

                {!isAdvanced ? (
                    <>
                        <input
                            type="text"
                            placeholder="Username"
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            style={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            style={styles.input}
                        />
                    </>
                ) : (
                    <div>
                        <p style={styles.hint}>💡 Advanced mode: Enter raw JSON payload</p>
                        <textarea
                            placeholder={'{\n  "username": "admin",\n  "password": "password"\n}'}
                            value={rawPayload}
                            onChange={(e) => setRawPayload(e.target.value)}
                            style={styles.textarea}
                            rows={8}
                        />
                        <div style={styles.exampleBox}>
                            <strong>Example NoSQL Injection:</strong>
                            <pre style={styles.code}>
                                {`{
  "username": {"$ne": null},
  "password": {"$ne": null}
}`}
                            </pre>
                        </div>
                    </div>
                )}

                <button onClick={handleLogin} style={styles.button}>
                    Login
                </button>

                {message && (
                    <div style={styles.message}>
                        {message}
                    </div>
                )}

                <div style={styles.links}>
                    <a href="/" style={styles.link}>← Back to Home</a>
                    <a href="/dashboard" style={styles.link}>Go to Dashboard →</a>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
    },
    loginBox: {
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '500px',
        width: '100%',
    },
    title: {
        color: '#667eea',
        textAlign: 'center' as const,
        marginBottom: '30px',
    },
    tabContainer: {
        display: 'flex',
        marginBottom: '20px',
        gap: '10px',
    },
    tab: {
        flex: 1,
        padding: '10px',
        border: '2px solid #667eea',
        background: 'white',
        color: '#667eea',
        cursor: 'pointer',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: 'bold',
    },
    activeTab: {
        background: '#667eea',
        color: 'white',
    },
    input: {
        width: '100%',
        padding: '12px',
        marginBottom: '15px',
        border: '2px solid #ddd',
        borderRadius: '6px',
        fontSize: '16px',
        boxSizing: 'border-box' as const,
    },
    textarea: {
        width: '100%',
        padding: '12px',
        marginBottom: '15px',
        border: '2px solid #ddd',
        borderRadius: '6px',
        fontSize: '14px',
        fontFamily: 'monospace',
        boxSizing: 'border-box' as const,
    },
    button: {
        width: '100%',
        padding: '14px',
        background: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '10px',
    },
    message: {
        marginTop: '20px',
        padding: '12px',
        background: '#f0f0f0',
        borderRadius: '6px',
        fontSize: '14px',
        wordBreak: 'break-all' as const,
    },
    links: {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    link: {
        color: '#667eea',
        textDecoration: 'none',
        fontSize: '14px',
    },
    hint: {
        fontSize: '14px',
        color: '#666',
        marginBottom: '10px',
    },
    exampleBox: {
        background: '#f8f9fa',
        padding: '15px',
        borderRadius: '6px',
        marginBottom: '15px',
        fontSize: '13px',
    },
    code: {
        background: '#2d2d2d',
        color: '#f8f8f2',
        padding: '10px',
        borderRadius: '4px',
        marginTop: '10px',
        overflow: 'auto',
    },
};
