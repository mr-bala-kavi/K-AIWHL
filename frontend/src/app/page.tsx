'use client';

import { useEffect, useState } from 'react';

export default function Home() {
    const [labInfo, setLabInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/')
            .then(res => res.json())
            .then(data => {
                setLabInfo(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch lab info:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
                <div className="text-white text-2xl">Loading...</div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        {labInfo?.name || 'K-AIWHL v2.0'}
                    </h1>
                    <p className="text-2xl text-gray-300 mb-2">
                        {labInfo?.description || 'DVWA-Style Modern Penetration Testing Lab'}
                    </p>
                    <p className="text-xl text-purple-400">
                        Version {labInfo?.version || '2.0.0'}
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-8 border border-purple-500">
                        <div className="text-4xl font-bold text-purple-400 mb-2">
                            {labInfo?.total_challenges || 25}
                        </div>
                        <div className="text-gray-300">Total Challenges</div>
                    </div>
                    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-8 border border-pink-500">
                        <div className="text-4xl font-bold text-pink-400 mb-2">
                            {labInfo?.total_points || 1100}
                        </div>
                        <div className="text-gray-300">Total Points</div>
                    </div>
                    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-8 border border-blue-500">
                        <div className="text-4xl font-bold text-blue-400 mb-2">
                            {labInfo?.categories?.length || 6}
                        </div>
                        <div className="text-gray-300">Categories</div>
                    </div>
                </div>

                {/* Categories */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center">Challenge Categories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {labInfo?.categories?.map((category: string) => (
                            <div
                                key={category}
                                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all cursor-pointer"
                            >
                                <h3 className="text-xl font-semibold capitalize mb-2 text-purple-400">
                                    {category}
                                </h3>
                                <p className="text-gray-400 text-sm">Explore {category} vulnerabilities</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Getting Started */}
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-8 border border-purple-500 mb-16">
                    <h2 className="text-3xl font-bold mb-6">🚀 Getting Started</h2>
                    <div className="space-y-4 text-gray-300">
                        <p>1. <strong className="text-purple-400">Use Burp Suite</strong> to intercept and modify requests</p>
                        <p>2. <strong className="text-pink-400">Kali Linux tools</strong> required (sqlmap, dirb, ffuf, curl)</p>
                        <p>3. <strong className="text-blue-400">No direct flag access</strong> - must exploit vulnerabilities</p>
                        <p>4. <strong className="text-green-400">Base64 decode</strong> flags when found</p>
                    </div>
                </div>

                {/* API Endpoints */}
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-8 border border-blue-500">
                    <h2 className="text-3xl font-bold mb-6">📡 API Endpoints</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
                        <div className="bg-gray-900 p-4 rounded">
                            <span className="text-green-400">GET</span> <span className="text-gray-300">/challenges/auth/login</span>
                        </div>
                        <div className="bg-gray-900 p-4 rounded">
                            <span className="text-green-400">GET</span> <span className="text-gray-300">/challenges/access/user/:id</span>
                        </div>
                        <div className="bg-gray-900 p-4 rounded">
                            <span className="text-blue-400">POST</span> <span className="text-gray-300">/challenges/llm/chat</span>
                        </div>
                        <div className="bg-gray-900 p-4 rounded">
                            <span className="text-blue-400">POST</span> <span className="text-gray-300">/challenges/injection/ping</span>
                        </div>
                    </div>
                    <div className="mt-6 text-center">
                        <a
                            href="http://localhost:5000/docs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                        >
                            View Full API Documentation
                        </a>
                    </div>
                </div>

                {/* Warning */}
                <div className="mt-16 bg-red-900 bg-opacity-30 border-2 border-red-500 rounded-lg p-6 text-center">
                    <h3 className="text-2xl font-bold text-red-400 mb-2">⚠️ WARNING</h3>
                    <p className="text-gray-300">
                        This lab is <strong>intentionally vulnerable</strong> for educational purposes only.
                        <br />
                        <strong>NEVER</strong> deploy to production or public networks!
                    </p>
                </div>
            </div>
        </main>
    );
}
