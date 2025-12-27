'use client';

export default function ProfilePage({ params }: { params: { id: string } }) {
    return (
        <div style={styles.container}>
            <h1>Profile: {params.id}</h1>
            <p>This page demonstrates IDOR vulnerability.</p>
            <p>Try accessing different user IDs in the URL!</p>
            <a href="/dashboard" style={styles.link}>← Back to Dashboard</a>
        </div>
    );
}

const styles = {
    container: {
        padding: '40px',
        maxWidth: '800px',
        margin: '0 auto',
    },
    link: {
        color: '#667eea',
        textDecoration: 'none',
    },
};
