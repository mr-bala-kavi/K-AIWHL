'use client';

import React, { useState, useEffect } from 'react';

export default function FlagSubmissionPage() {
    const [flag, setFlag] = useState('');
    const [message, setMessage] = useState('');
    const [progress, setProgress] = useState(null);
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
            console.error('Error fetching progress:', error);
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
                setMessage(`❌ ${data.detail || 'Incorrect flag. Try again!'}`);
            }
        } catch (error) {
            setMessage('❌ Error submitting flag. Check if backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-900 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
                    🚩 K-AIWHL CTF - Flag Submission
                </h1>

                {/* Score Card */}
                {progress && (
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
                        <h2 className="text-2xl font-bold text-center mb-4">Your Progress</h2>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center">
                                <div className="text-sm opacity-90">Total Score</div>
                                <div className="text-3xl font-bold">{progress.total_points} / 1100</div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm opacity-90">Solved</div>
                                <div className="text-3xl font-bold">
                                    {progress.solved_challenges?.length || 0} / 25
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm opacity-90">Rank</div>
                                <div className="text-2xl font-bold">
                                    {progress.total_points > 800 ? '🥇 Elite' :
                                        progress.total_points > 500 ? '🥈 Advanced' :
                                            progress.total_points > 200 ? '🥉 Intermediate' : '👨‍💻 Beginner'}
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/30 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-white h-full transition-all duration-500"
                                style={{ width: `${(progress.total_points / 1100) * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Flag Submission Form */}
                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Enter Flag:
                        </label>
                        <input
                            type="text"
                            value={flag}
                            onChange={(e) => setFlag(e.target.value)}
                            placeholder="flag{CATEGORY_L1_example_fl4g}"
                            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none font-mono"
                            disabled={loading}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xl font-bold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-60"
                    >
                        {loading ? 'Submitting...' : 'Submit Flag'}
                    </button>

                    {message && (
                        <div className={`mt-6 p-4 rounded-xl ${message.startsWith('✅')
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : 'bg-red-100 text-red-800 border border-red-300'
                            }`}>
                            {message}
                        </div>
                    )}
                </form>

                {/* Instructions */}
                <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">📚 How to Play:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                        <li>Explore challenges using Burp Suite & Kali Linux tools</li>
                        <li>Find hidden flags in DB, files, headers, JWT tokens, etc.</li>
                        <li>Submit flags here to earn points</li>
                        <li>Track your progress and compete for top rank!</li>
                    </ol>
                    <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-900">
                        💡 <strong>Hint:</strong> Flags follow format: <code className="bg-yellow-100 px-2 py-1 rounded">flag&#123;CATEGORY_LX_description&#125;</code>
                    </div>
                </div>

                {/* Solved Challenges */}
                {progress && progress.solved_challenges && progress.solved_challenges.length > 0 && (
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            ✅ Solved Challenges ({progress.solved_challenges.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {progress.solved_challenges.map((challenge: string, index: number) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                                >
                                    {challenge}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
