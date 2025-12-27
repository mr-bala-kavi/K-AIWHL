'use client';

import { useState, useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';
import { fetchAPI, profileAPI, uploadAPI, oauthAPI, challengesAPI, progressAPI } from '@/lib/api';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [ssrfUrl, setSsrfUrl] = useState('');
    const [ssrfResult, setSsrfResult] = useState('');
    const [profileId, setProfileId] = useState('1');
    const [profileData, setProfileData] = useState('');
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadType, setUploadType] = useState('pickle');
    const [uploadResult, setUploadResult] = useState('');
    const [oauthResult, setOauthResult] = useState('');

    // New state for progress and challenges
    const [userProgress, setUserProgress] = useState<any>(null);
    const [challenges, setChallenges] = useState<any[]>([]);

    const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
    const [flagInput, setFlagInput] = useState('');
    const [flagResult, setFlagResult] = useState('');
    const [loading, setLoading] = useState(true);

    // Load all data on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const [progressData, challengesData] = await Promise.all([
                    progressAPI.getProgress('default_user'),
                    challengesAPI.list()
                ]);

                setUserProgress(progressData);
                setChallenges(challengesData);
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

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

    const handleFlagSubmit = async () => {
        if (!selectedChallenge || !flagInput.trim()) return;

        try {
            const result = await challengesAPI.submitFlag(selectedChallenge.id, flagInput.trim(), false);
            setFlagResult(JSON.stringify(result, null, 2));

            // Refresh progress if flag was correct
            if (result.correct) {
                const updatedProgress = await progressAPI.getProgress('default_user');
                setUserProgress(updatedProgress);
                setFlagInput('');
            }
        } catch (error: any) {
            setFlagResult('Error: ' + error.message);
        }
    };

    // Helper function to get difficulty color
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'low': return '#4caf50';
            case 'medium': return '#ff9800';
            case 'high': return '#f44336';
            case 'extreme': return '#9c27b0';
            default: return '#666';
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <h2>Loading dashboard...</h2>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>🎯 K-AIWHL Dashboard</h1>
                <a href="/" style={styles.homeLink}>← Home</a>
            </div>

            {/* User Stats Panel */}
            <div style={styles.statsPanel}>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{userProgress?.total_points || 0}</div>
                    <div style={styles.statLabel}>Points Earned</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{userProgress?.solved_challenges?.length || 0}</div>
                    <div style={styles.statLabel}>Challenges Solved</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{challenges.length || 0}</div>
                    <div style={styles.statLabel}>Total Challenges</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>
                        {challenges.length > 0 ? Math.round((userProgress?.solved_challenges?.length || 0) / challenges.length * 100) : 0}%
                    </div>
                    <div style={styles.statLabel}>Completion Rate</div>
                </div>
            </div>

            <div style={styles.tabs}>
                {['overview', 'challenges', 'leaderboard', 'chat', 'ssrf', 'idor', 'upload', 'oauth'].map(tab => (
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
                {activeTab === 'overview' && (
                    <div>
                        <h2>📊 Your Progress</h2>
                        <div style={styles.panel}>
                            <h3>🎯 Stats</h3>
                            <p>Username: <strong>{userProgress?.username || 'default_user'}</strong></p>
                            <p>Total Points: <strong style={{ color: '#667eea', fontSize: '24px' }}>{userProgress?.total_points || 0}</strong></p>
                            <p>Challenges Solved: <strong>{userProgress?.solved_challenges?.length || 0}/{challenges.length}</strong></p>
                            <p>Hints Used: <strong>{userProgress?.hints_used || 0}</strong></p>

                            <h3 style={{ marginTop: '30px' }}>✅ Completed Challenges</h3>
                            {userProgress?.solved_challenges?.length > 0 ? (
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {userProgress.solved_challenges.map((id: string) => {
                                        const challenge = challenges.find(c => c.id === id);
                                        return challenge ? (
                                            <li key={id} style={{ padding: '8px', background: '#f0f0f0', margin: '5px 0', borderRadius: '4px' }}>
                                                ✓ {challenge.title} ({challenge.points} points)
                                            </li>
                                        ) : null;
                                    })}
                                </ul>
                            ) : (
                                <p style={{ color: '#666' }}>No challenges solved yet. Start exploring!</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'challenges' && (
                    <div>
                        <h2>🎯 All Challenges</h2>
                        <div style={styles.panel}>
                            <div style={{ marginBottom: '20px' }}>
                                <p style={styles.hint}>
                                    Select a challenge to view details and submit flags.
                                    Total: {challenges.length} challenges | Solved: {userProgress?.solved_challenges?.length || 0}
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                                {challenges.map((challenge: any) => {
                                    const isSolved = userProgress?.solved_challenges?.includes(challenge.id);
                                    return (
                                        <div
                                            key={challenge.id}
                                            onClick={() => setSelectedChallenge(challenge)}
                                            style={{
                                                ...styles.challengeCard,
                                                border: selectedChallenge?.id === challenge.id ? '3px solid #667eea' : '1px solid #ddd',
                                                background: isSolved ? '#e8f5e9' : 'white'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                <h3 style={{ margin: 0, fontSize: '16px', flex: 1 }}>
                                                    {isSolved && '✅ '}{challenge.title}
                                                </h3>
                                                <span style={{ ...styles.badge, background: getDifficultyColor(challenge.difficulty) }}>
                                                    {challenge.difficulty}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '12px', color: '#666', margin: '8px 0' }}>{challenge.category}</p>
                                            <p style={{ fontSize: '14px', margin: '8px 0' }}>{challenge.description}</p>
                                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#667eea', marginTop: '10px' }}>
                                                {challenge.points} points
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {selectedChallenge && (
                                <div style={{ ...styles.panel, marginTop: '30px', background: '#f8f9fa' }}>
                                    <h3>📋 {selectedChallenge.title}</h3>
                                    <p><strong>Category:</strong> {selectedChallenge.category}</p>
                                    <p><strong>Difficulty:</strong> {selectedChallenge.difficulty}</p>
                                    <p><strong>Points:</strong> {selectedChallenge.points}</p>
                                    <p><strong>Objective:</strong> {selectedChallenge.objective}</p>
                                    <p><strong>Endpoint:</strong> <code>{selectedChallenge.endpoint}</code></p>

                                    <div style={{ marginTop: '20px' }}>
                                        <h4>🚩 Submit Flag</h4>
                                        <input
                                            type="text"
                                            placeholder="flag{...}"
                                            value={flagInput}
                                            onChange={(e) => setFlagInput(e.target.value)}
                                            style={styles.input}
                                        />
                                        <button onClick={handleFlagSubmit} style={styles.button}>Submit Flag</button>
                                        {flagResult && (
                                            <pre style={styles.result}>{flagResult}</pre>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}


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
    statsPanel: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '20px',
    },
    statCard: {
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center' as const,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '2px solid #667eea',
    },
    statValue: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#667eea',
        marginBottom: '8px',
    },
    statLabel: {
        fontSize: '14px',
        color: '#666',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
    },
    challengeCard: {
        padding: '15px',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    badge: {
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 'bold',
        color: 'white',
        textTransform: 'uppercase' as const,
        marginLeft: '8px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse' as const,
        marginTop: '20px',
    },
    th: {
        padding: '12px',
        textAlign: 'left' as const,
        background: '#667eea',
        color: 'white',
        fontWeight: 'bold',
    },
    td: {
        padding: '12px',
        borderBottom: '1px solid #ddd',
    },
};
