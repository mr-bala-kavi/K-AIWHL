'use client';

import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import { fetchAPI, profileAPI, uploadAPI, oauthAPI } from '@/lib/api';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('chat');
    const [ssrfUrl, setSsrfUrl] = useState('');
    const [ssrfResult, setSsrfResult] = useState('');
    const [profileId, setProfileId] = useState('1');
    const [profileData, setProfileData] = useState('');
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadType, setUploadType] = useState('pickle');
    const [uploadResult, setUploadResult] = useState('');
    const [oauthResult, setOauthResult] = useState('');

    const handleSSRF = async () => {
        try {
            const result = await fetchAPI.fetchUrl(ssrfUrl);
            setSsrfResult(JSON.stringify(result, null, 2));
        } catch (error: any) {
            setSsrfResult('Error: ' + error.message);
        }
    };

    const handleProfileFetch = async () => {
        try {
            const result = await profileAPI.getProfile(profileId);
            setProfileData(JSON.stringify(result, null, 2));
        } catch (error: any) {
            setProfileData('Error: ' + error.message);
        }
    };

    const handleUpload = async () => {
        if (!uploadFile) return;
        try {
            const result = await uploadAPI.uploadFile(uploadFile, uploadType);
            setUploadResult(JSON.stringify(result, null, 2));
        } catch (error: any) {
            setUploadResult('Error: ' + error.message);
        }
    };

    const handleOAuth = async () => {
        try {
            // Test OAuth without state
            const result = await oauthAPI.callback('fake_code_123');
            setOauthResult(JSON.stringify(result, null, 2));
        } catch (error: any) {
            setOauthResult('Error: ' + error.message);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>🎯 K-AIWHL Dashboard</h1>
                <a href="/" style={styles.homeLink}>← Home</a>
            </div>

            <div style={styles.tabs}>
                {['chat', 'ssrf', 'idor', 'upload', 'oauth'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{ ...styles.tab, ...(activeTab === tab ? styles.activeTab : {}) }}
                    >
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>

            <div style={styles.content}>
                {activeTab === 'chat' && (
                    <div>
                        <h2>🤖 AI Chat Interface</h2>
                        <p style={styles.hint}>Try prompt injection, RAG poisoning, or XSS attacks</p>
                        <ChatInterface />
                    </div>
                )}

                {activeTab === 'ssrf' && (
                    <div style={styles.panel}>
                        <h2>🌐 URL Fetcher (SSRF Test)</h2>
                        <p style={styles.hint}>Try: file:///etc/passwd, http://localhost:5000/internal-admin, http://backend:5000/api/fetch/internal-admin</p>
                        <input
                            type="text"
                            placeholder="Enter URL"
                            value={ssrfUrl}
                            onChange={(e) => setSsrfUrl(e.target.value)}
                            style={styles.input}
                        />
                        <button onClick={handleSSRF} style={styles.button}>Fetch URL</button>
                        {ssrfResult && (
                            <pre style={styles.result}>{ssrfResult}</pre>
                        )}
                    </div>
                )}

                {activeTab === 'idor' && (
                    <div style={styles.panel}>
                        <h2>👤 Profile Viewer (IDOR Test)</h2>
                        <p style={styles.hint}>Try different user IDs: 1, 2, admin, user</p>
                        <input
                            type="text"
                            placeholder="User ID"
                            value={profileId}
                            onChange={(e) => setProfileId(e.target.value)}
                            style={styles.input}
                        />
                        <button onClick={handleProfileFetch} style={styles.button}>Get Profile</button>
                        {profileData && (
                            <pre style={styles.result}>{profileData}</pre>
                        )}
                    </div>
                )}

                {activeTab === 'upload' && (
                    <div style={styles.panel}>
                        <h2>📤 File Upload (RCE Test)</h2>
                        <p style={styles.hint}>Upload malicious pickle, YAML, or config files</p>
                        <input
                            type="file"
                            onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                            style={styles.input}
                        />
                        <select
                            value={uploadType}
                            onChange={(e) => setUploadType(e.target.value)}
                            style={styles.input}
                        >
                            <option value="pickle">Pickle</option>
                            <option value="yaml">YAML</option>
                            <option value="config">Config (eval)</option>
                        </select>
                        <button onClick={handleUpload} style={styles.button}>Upload File</button>
                        {uploadResult && (
                            <pre style={styles.result}>{uploadResult}</pre>
                        )}
                    </div>
                )}

                {activeTab === 'oauth' && (
                    <div style={styles.panel}>
                        <h2>🔑 OAuth Test (Broken State)</h2>
                        <p style={styles.hint}>Test OAuth callback without proper state validation</p>
                        <button onClick={handleOAuth} style={styles.button}>Test OAuth Callback</button>
                        {oauthResult && (
                            <pre style={styles.result}>{oauthResult}</pre>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        background: '#f5f5f5',
        padding: '20px',
    },
    header: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        margin: 0,
    },
    homeLink: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '16px',
    },
    tabs: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        flexWrap: 'wrap' as const,
    },
    tab: {
        padding: '12px 24px',
        background: 'white',
        border: '2px solid #667eea',
        color: '#667eea',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
    },
    activeTab: {
        background: '#667eea',
        color: 'white',
    },
    content: {
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    panel: {
        maxWidth: '800px',
    },
    hint: {
        color: '#666',
        fontSize: '14px',
        fontStyle: 'italic',
        marginBottom: '20px',
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
    button: {
        padding: '12px 24px',
        background: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
    },
    result: {
        marginTop: '20px',
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '6px',
        fontSize: '13px',
        overflow: 'auto',
        maxHeight: '400px',
        border: '1px solid #ddd',
    },
};
