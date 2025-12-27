'use client';

import React, { useState, useEffect } from 'react';

export default function Home() {
    const [flag, setFlag] = useState('');
    const [message, setMessage] = useState('');
    const [progress, setProgress] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/challenges/progress/user1');
            const data = await response.json();
            setProgress(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/challenges/submit-flag', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: 'user1', flag: flag.trim() }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`✅ Correct! +${data.points} points. ${data.message}`);
                setFlag('');
                fetchProgress();
            } else {
                setMessage(`❌ ${data.detail || 'Incorrect flag'}`);
            }
        } catch (error) {
            setMessage('❌ Backend error. Is Docker running?');
        } finally {
            setLoading(false);
        }
    };

    const getRank = (points: number) => {
        if (points > 800) return { emoji: '🥇', text: 'Elite Hacker', color: '#FFD700' };
        if (points > 500) return { emoji: '🥈', text: 'Advanced', color: '#C0C0C0' };
        if (points > 200) return { emoji: '🥉', text: 'Intermediate', color: '#CD7F32' };
        return { emoji: '👨‍💻', text: 'Beginner', color: '#6B7280' };
    };

    const rank = progress ? getRank(progress.total_points) : { emoji: '👨‍💻', text: 'Beginner', color: '#6B7280' };

    return (
        <div style={styles.container}>
            <div style={styles.background}>
                <div style={styles.circle1}></div>
                <div style={styles.circle2}></div>
            </div>

            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>
                        🚩 K-AIWHL v2.0
                    </h1>
                    <p style={styles.subtitle}>Modern Web Hacking Lab - DVWA Style</p>
                </div>

                {/* Score Dashboard */}
                {progress && (
                    <div style={styles.scoreCard}>
                        <h2 style={styles.scoreTitle}>🏆 Your Progress</h2>

                        <div style={styles.statsGrid}>
                            <div style={styles.statBox}>
                                <div style={styles.statLabel}>Total Score</div>
                                <div style={styles.statValue}>{progress.total_points}</div>
                                <div style={styles.statSubtext}>/ 1100 points</div>
                            </div>

                            <div style={styles.statBox}>
                                <div style={styles.statLabel}>Challenges</div>
                                <div style={styles.statValue}>{progress.solved_challenges?.length || 0}</div>
                                <div style={styles.statSubtext}>/ 25 solved</div>
                            </div>

                            <div style={{ ...styles.statBox, borderColor: rank.color }}>
                                <div style={styles.statLabel}>Rank</div>
                                <div style={{ ...styles.statValue, color: rank.color }}>
                                    {rank.emoji}
                                </div>
                                <div style={styles.statSubtext}>{rank.text}</div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={styles.progressContainer}>
                            <div
                                style={{
                                    ...styles.progressBar,
                                    width: `${(progress.total_points / 1100) * 100}%`
                                }}
                            >
                                <div style={styles.progressGlow}></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Flag Submission */}
                <div style={styles.formCard}>
                    <h2 style={styles.formTitle}>📝 Submit Flag</h2>

                    <form onSubmit={handleSubmit}>
                        <div style={styles.inputWrapper}>
                            <input
                                type="text"
                                value={flag}
                                onChange={(e) => setFlag(e.target.value)}
                                placeholder="flag{CATEGORY_L1_example_fl4g}"
                                style={styles.input}
                                disabled={loading}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                ...styles.button,
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                            disabled={loading}
                        >
                            {loading ? '⏳ Submitting...' : '🚀 Submit Flag'}
                        </button>
                    </form>

                    {message && (
                        <div style={{
                            ...styles.message,
                            background: message.startsWith('✅')
                                ? 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)'
                                : 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)',
                            color: message.startsWith('✅') ? '#155724' : '#721c24',
                            borderLeft: `4px solid ${message.startsWith('✅') ? '#28a745' : '#dc3545'}`
                        }}>
                            {message}
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div style={styles.infoCard}>
                    <h3 style={styles.infoTitle}>📚 How to Play</h3>
                    <ol style={styles.list}>
                        <li style={styles.listItem}>🔍 Explore 25 challenges using <strong>Burp Suite</strong> & <strong>Kali Linux</strong></li>
                        <li style={styles.listItem}>🎯 Find flags hidden in databases, files, headers, JWT tokens, etc.</li>
                        <li style={styles.listItem}>📊 Submit flags above to earn points (10-100 per challenge)</li>
                        <li style={styles.listItem}>🏆 Track progress and compete for top rank!</li>
                    </ol>

                    <div style={styles.hint}>
                        <span style={styles.hintIcon}>💡</span>
                        <span style={styles.hintText}>
                            <strong>Flag Format:</strong> <code style={styles.code}>flag&#123;CATEGORY_LX_description&#125;</code>
                        </span>
                    </div>
                </div>

                {/* Solved Badges */}
                {progress && progress.solved_challenges && progress.solved_challenges.length > 0 && (
                    <div style={styles.badgesSection}>
                        <h3 style={styles.badgesTitle}>
                            ✅ Solved Challenges ({progress.solved_challenges.length}/25)
                        </h3>
                        <div style={styles.badgesGrid}>
                            {progress.solved_challenges.map((challenge: string, index: number) => (
                                <span key={index} style={styles.badge}>
                                    {challenge}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        🔒 Educational Use Only · NEVER Deploy to Production
                    </p>
                    <p style={styles.footerSubtext}>
                        K-AIWHL v2.0 - Modern Penetration Testing Lab
                    </p>
                </div>
            </div>
        </div>
    );
}

const styles: any = {
    container: {
        minHeight: '100vh',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
        position: 'relative',
        overflow: 'hidden',
    },
    background: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        zIndex: -1,
    },
    circle1: {
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        top: '-250px',
        right: '-250px',
        animation: 'float 20s infinite ease-in-out',
    },
    circle2: {
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        bottom: '-200px',
        left: '-200px',
        animation: 'float 15s infinite ease-in-out reverse',
    },
    card: {
        maxWidth: '900px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '30px',
        padding: '50px',
        boxShadow: '0 30px 90px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        zIndex: 1,
    },
    header: {
        textAlign: 'center' as const,
        marginBottom: '40px',
    },
    title: {
        fontSize: '48px',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '10px',
    },
    subtitle: {
        fontSize: '18px',
        color: '#6B7280',
        fontWeight: '500',
    },
    scoreCard: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '25px',
        padding: '35px',
        marginBottom: '35px',
        color: 'white',
        boxShadow: '0 15px 40px rgba(102, 126, 234, 0.4)',
    },
    scoreTitle: {
        fontSize: '28px',
        fontWeight: '700',
        textAlign: 'center' as const,
        marginBottom: '30px',
        textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginBottom: '25px',
    },
    statBox: {
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '15px',
        padding: '20px',
        textAlign: 'center' as const,
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
    },
    statLabel: {
        fontSize: '13px',
        opacity: 0.9,
        marginBottom: '8px',
        textTransform: 'uppercase' as const,
        letterSpacing: '1px',
    },
    statValue: {
        fontSize: '36px',
        fontWeight: '800',
        margin: '5px 0',
    },
    statSubtext: {
        fontSize: '12px',
        opacity: 0.8,
    },
    progressContainer: {
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '15px',
        height: '15px',
        overflow: 'hidden',
        position: 'relative' as const,
    },
    progressBar: {
        height: '100%',
        background: 'linear-gradient(90deg, #ffffff 0%, #f0f0f0 100%)',
        borderRadius: '15px',
        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative' as const,
    },
    progressGlow: {
        position: 'absolute' as const,
        top: 0,
        right: 0,
        width: '100px',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5))',
        animation: 'shimmer 2s infinite',
    },
    formCard: {
        marginBottom: '35px',
    },
    formTitle: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: '20px',
    },
    inputWrapper: {
        marginBottom: '20px',
    },
    input: {
        width: '100%',
        padding: '18px 25px',
        fontSize: '18px',
        border: '3px solid #E5E7EB',
        borderRadius: '15px',
        outline: 'none',
        transition: 'all 0.3s',
        fontFamily: 'Monaco, Consolas, monospace',
        boxSizing: 'border-box' as const,
    },
    button: {
        width: '100%',
        padding: '18px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '15px',
        fontSize: '20px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
    },
    message: {
        marginTop: '20px',
        padding: '18px 25px',
        borderRadius: '15px',
        fontSize: '16px',
        fontWeight: '500',
        animation: 'slideIn 0.3s ease-out',
    },
    infoCard: {
        background: '#F9FAFB',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '35px',
    },
    infoTitle: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: '20px',
    },
    list: {
        marginLeft: '25px',
        lineHeight: '2',
        color: '#4B5563',
    },
    listItem: {
        marginBottom: '12px',
        fontSize: '16px',
    },
    hint: {
        marginTop: '20px',
        padding: '18px',
        background: '#FEF3C7',
        borderLeft: '5px solid #F59E0B',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    hintIcon: {
        fontSize: '24px',
    },
    hintText: {
        color: '#92400E',
        fontSize: '15px',
    },
    code: {
        background: '#FDE68A',
        padding: '3px 8px',
        borderRadius: '5px',
        fontFamily: 'Monaco, Consolas, monospace',
        fontSize: '14px',
    },
    badgesSection: {
        marginTop: '30px',
    },
    badgesTitle: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: '20px',
    },
    badgesGrid: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: '12px',
    },
    badge: {
        background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
        color: '#065F46',
        padding: '10px 18px',
        borderRadius: '25px',
        fontSize: '14px',
        fontWeight: '600',
        border: '2px solid #6EE7B7',
    },
    footer: {
        marginTop: '40px',
        textAlign: 'center' as const,
        paddingTop: '30px',
        borderTop: '2px solid #E5E7EB',
    },
    footerText: {
        color: '#9CA3AF',
        fontSize: '14px',
        marginBottom: '8px',
    },
    footerSubtext: {
        color: '#D1D5DB',
        fontSize: '12px',
    },
};
