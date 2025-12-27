import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'K-AIWHL - AI Security CTF Lab',
    description: 'Modern AI-Integrated Web Hacking Lab for Cybersecurity Training',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body style={{ margin: 0, padding: 0 }}>{children}</body>
        </html>
    )
}
