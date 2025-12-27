'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px'
            }}>
                Loading...
            </div>
        );
    }

    return (
        <main style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
            color: 'white',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
                {/* Hero Section */}
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <div style={{
                        fontSize: '72px',
                        fontWeight: 'bold',
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '20px',
                        textShadow: '0 0 40px rgba(102, 126, 234, 0.5)'
                    }}>
                        {labInfo?.name || 'K-AIWHL v2.0'}
                    </div>
                    <p style={{
                        fontSize: '28px',
                        color: '#c4c4c4',
                        marginBottom: '15px'
                    }}>
                        {labInfo?.description || 'Modern AI-Integrated Penetration Testing Lab'}
                    </p>
                    <p style={{
                        fontSize: '18px',
                        color: '#9d9d9d',
                        marginBottom: '50px'
                    }}>
                        Version {labInfo?.version || '2.0.0'} • {labInfo?.total_challenges || 25} Challenges • {labInfo?.total_points || 1100} Points
                    </p>

                    {/* Call to Action Buttons */}
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/dashboard" style={{
                            display: 'inline-block',
                            padding: '18px 48px',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            color: 'white',
                            textDecoration: 'none',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.6)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
                            }}>
                            🚀 Enter Lab Dashboard
                        </Link>

                        <a href="http://localhost:5000/docs" target="_blank" rel="noopener noreferrer" style={{
                            display: 'inline-block',
                            padding: '18px 48px',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            background: 'transparent',
                            border: '3px solid #667eea',
                            borderRadius: '12px',
                            color: '#667eea',
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = '#667eea';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#667eea';
                            }}>
                            📚 API Documentation
                        </a>
                    </div>
                </div>

                {/* Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '30px',
                    marginBottom: '80px'
                }}>
                    <div style={{
                        background: 'rgba(102, 126, 234, 0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        padding: '40px',
                        border: '2px solid rgba(102, 126, 234, 0.3)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '56px', fontWeight: 'bold', color: '#667eea', marginBottom: '10px' }}>
                            {labInfo?.total_challenges || 25}
                        </div>
                        <div style={{ fontSize: '18px', color: '#c4c4c4' }}>Total Challenges</div>
                    </div>
                    <div style={{
                        background: 'rgba(246, 147, 251, 0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        padding: '40px',
                        border: '2px solid rgba(246, 147, 251, 0.3)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '56px', fontWeight: 'bold', color: '#f093fb', marginBottom: '10px' }}>
                            {labInfo?.total_points || 1100}
                        </div>
                        <div style={{ fontSize: '18px', color: '#c4c4c4' }}>Total Points</div>
                    </div>
                    <div style={{
                        background: 'rgba(118, 75, 162, 0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        padding: '40px',
                        border: '2px solid rgba(118, 75, 162, 0.3)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '56px', fontWeight: 'bold', color: '#764ba2', marginBottom: '10px' }}>
                            {labInfo?.categories?.length || 6}
                        </div>
                        <div style={{ fontSize: '18px', color: '#c4c4c4' }}>Categories</div>
                    </div>
                </div>

                {/* Categories */}
                <div style={{ marginBottom: '80px' }}>
                    <h2 style={{
                        fontSize: '42px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginBottom: '40px',
                        color: 'white'
                    }}>
                        🎯 Challenge Categories
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '25px'
                    }}>
                        {labInfo?.categories?.map((category: string) => (
                            <Link
                                href="/dashboard"
                                key={category}
                                style={{
                                    background: 'linear-gradient(135deg, rgba(30, 30, 46, 0.8) 0%, rgba(24, 24, 37, 0.8) 100%)',
                                    borderRadius: '12px',
                                    padding: '30px',
                                    border: '2px solid rgba(102, 126, 234, 0.2)',
                                    transition: 'all 0.3s',
                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                    display: 'block'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.border = '2px solid rgba(102, 126, 234, 0.6)';
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.border = '2px solid rgba(102, 126, 234, 0.2)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <h3 style={{
                                    fontSize: '24px',
                                    fontWeight: '600',
                                    textTransform: 'capitalize',
                                    marginBottom: '10px',
                                    color: '#667eea'
                                }}>
                                    {category.replace('_', ' ')}
                                </h3>
                                <p style={{ color: '#9d9d9d', fontSize: '16px' }}>
                                    Explore {category.replace('_', ' ')} vulnerabilities
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Warning */}
                <div style={{
                    background: 'rgba(220, 38, 38, 0.15)',
                    border: '3px solid rgba(220, 38, 38, 0.5)',
                    borderRadius: '12px',
                    padding: '30px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: '#f87171', marginBottom: '15px' }}>
                        ⚠️ WARNING
                    </h3>
                    <p style={{ fontSize: '18px', color: '#c4c4c4', lineHeight: '1.6' }}>
                        This lab is <strong>intentionally vulnerable</strong> for educational purposes only.
                        <br />
                        <strong style={{ color: '#f87171' }}>NEVER</strong> deploy to production or public networks!
                    </p>
                </div>
            </div>
        </main>
    );
}
