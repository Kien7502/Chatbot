import React from 'react';

const Layout = ({ children }) => {
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.logo}>AI Writing Partner</div>
                <div style={styles.status}>B1-B2 Academic Writing</div>
            </header>
            <main style={styles.main}>
                <div style={styles.glassCard}>
                    {children}
                </div>
            </main>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
        boxSizing: 'border-box',
    },
    header: {
        width: '100%',
        maxWidth: '1000px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        color: 'var(--text-primary)',
    },
    logo: {
        fontFamily: 'var(--font-heading)',
        fontSize: '1.5rem',
        fontWeight: '700',
        background: 'linear-gradient(to right, #a5b4fc, #6366f1)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    status: {
        fontFamily: 'var(--font-body)',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
    },
    main: {
        width: '100%',
        maxWidth: '1000px',
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
    },
    glassCard: {
        width: '100%',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--glass-shadow)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
    },
};

export default Layout;
