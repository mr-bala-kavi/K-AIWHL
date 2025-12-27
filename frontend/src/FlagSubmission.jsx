import React, { useState, useEffect } from 'react';

export default function FlagSubmission() {
    const [flag, setFlag] = useState('');
    const [message, setMessage] = useState('');
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(false);

    // Load user progress on mount
    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/challenges/progress/user1');
            const data = await response.json();
            setProgress(data);
        } catch (error) {
            console.error('Error fetching progress:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/challenges/submit-flag', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: 'user1',
                    flag: flag.trim(),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`✅ Correct! +${data.points} points. ${data.message}`);
                setFlag('');
                fetchProgress(); // Refresh progress
            } else {
                setMessage(`❌ ${data.detail || 'Incorrect flag. Try again!'}`);
            }
        } catch (error) {
            setMessage('❌ Error submitting flag. Check if backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>🚩 K-AIWHL CTF - Flag Submission</h1>

                {/* Score Display */}
                {progress && (
                    <div style={styles.scoreCard}>
                        <h2 style={styles.scoreTitle}>Your Progress</h2>
                        <div style={styles.scoreGrid}>
                            <div style={styles.scoreItem}>
                                <span style={styles.scoreLabel}>Total Score</span>
                                <span style={styles.scoreValue}>{progress.total_points} / 1100</span>
                            </div>
                            <div style={styles.scoreItem}>
                                <span style={styles.scoreLabel}>Solved</span>
                                <span style={styles.scoreValue}>{progress.solved_challenges?.length || 0} / 25</span>
                            </div>
                            <div style={styles.scoreItem}>
                                <span style={styles.scoreLabel}>Rank</span>
                                <span style={styles.scoreValue}>
                                    {progress.total_points > 800 ? '🥇 Elite' :
                                        progress.total_points > 500 ? '🥈 Advanced' :
                                            progress.total_points > 200 ? '🥉 Intermediate' : '👨‍💻 Beginner'}
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={styles.progressBarContainer}>
                            <div
                                style={{
                                    ...styles.progressBar,
                                    width: `${(progress.total_points / 1100) * 100}%`
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Flag Submission Form */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Enter Flag:</label>
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
                        style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit Flag'}
                    </button>

                    {message && (
                        <div style={{
                            ...styles.message,
                            background: message.startsWith('✅') ? '#d4edda' : '#f8d7da',
                            color: message.startsWith('✅') ? '#155724' : '#721c24',
                            border: `1px solid ${message.startsWith('✅') ? '#c3e6cb' : '#f5c6cb'}`
                        }}>
                            {message}
                        </div>
                    )}
                </form>

                {/* Instructions */}
                <div style={styles.instructions}>
                    <h3 style={styles.instructionsTitle}>📚 How to Play:</h3>
                    <ol style={styles.list}>
                        <li>Explore the challenges using Burp Suite & Kali Linux tools</li>
                        <li>Find hidden flags in various locations (DB, files, headers, etc.)</li>
                        <li>Submit flags here to earn points</li>
                        <li>Track your progress and compete for the top rank!</li>
                    </ol>

                    <div style={styles.hint}>
                        💡 <strong>Hint:</strong> Flags follow the format: <code>flag&#123;CATEGORY_LX_description&#125;</code>
                    </div>
                </div>

                {/* Solved Challenges */}
                {progress && progress.solved_challenges && progress.solved_challenges.length > 0 && (
                    <div style={styles.solvedSection}>
                        <h3 style={styles.solvedTitle}>✅ Solved Challenges ({progress.solved_challenges.length})</h3>
                        <div style={styles.solvedGrid}>
                            {progress.solved_challenges.map((challenge, index) => (
                                <div key={index} style={styles.solvedBadge}>
                                    {challenge}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    card: {
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    },
    title: {
        textAlign: 'center',
        color: '#2d3748',
        marginBottom: '30px',
        fontSize: '32px',
    },
    scoreCard: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '30px',
        color: 'white',
    },
    scoreTitle: {
        margin: '0 0 20px 0',
        fontSize: '20px',
        textAlign: 'center',
    },
    scoreGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '15px',
        marginBottom: '20px',
    },
    scoreItem: {
        textAlign: 'center',
    },
    scoreLabel: {
        display: 'block',
        fontSize: '12px',
        opacity: 0.9,
        marginBottom: '5px',
    },
    scoreValue: {
        display: 'block',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    progressBarContainer: {
        background: 'rgba(255,255,255,0.3)',
        borderRadius: '10px',
        height: '10px',
        overflow: 'hidden',
    },
    progressBar: {
        background: 'white',
        height: '100%',
        transition: 'width 0.5s ease',
    },
    form: {
        marginBottom: '30px',
    },
    inputGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#2d3748',
        fontWeight: '600',
    },
    input: {
        width: '100%',
        padding: '15px',
        fontSize: '16px',
        border: '2px solid #e2e8f0',
        borderRadius: '10px',
        outline: 'none',
        transition: 'border-color 0.2s',
        fontFamily: 'monospace',
    },
    button: {
        width: '100%',
        padding: '15px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'transform 0.2s',
    },
    message: {
        marginTop: '20px',
        padding: '15px',
        borderRadius: '10px',
        fontSize: '16px',
    },
    instructions: {
        background: '#f7fafc',
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '20px',
    },
    instructionsTitle: {
        margin: '0 0 15px 0',
        color: '#2d3748',
    },
    list: {
        marginLeft: '20px',
        lineHeight: '1.8',
        color: '#4a5568',
    },
    hint: {
        marginTop: '15px',
        padding: '12px',
        background: '#fff5e6',
        borderLeft: '4px solid #f59e0b',
        borderRadius: '5px',
        color: '#92400e',
    },
    solvedSection: {
        marginTop: '20px',
    },
    solvedTitle: {
        color: '#2d3748',
        marginBottom: '15px',
    },
    solvedGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
    },
    solvedBadge: {
        background: '#d4edda',
        color: '#155724',
        padding: '8px 15px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '500',
    },
};
