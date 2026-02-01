import React from 'react';

const ReflectionView = ({ sessionData, result, onReset }) => {
    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Practice Completed</h2>
            <p style={styles.subtitle}>Great job for practicing today!</p>

            <div style={styles.grid}>
                {/* Your Text */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Your Writing</h3>
                    <p style={styles.textPreview}>"{result.text}"</p>
                </div>

                {/* Metalinguistic Feedback */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Observation</h3>
                    <ul style={styles.list}>
                        <li>You used <strong>{result.text.split('.').length - 1} sentences</strong>.</li>
                        <li>You engaged with the AI partner <strong>{result.messages.length} times</strong>.</li>
                        <li>Focus vocabulary found: <em>(Mock analysis would go here)</em></li>
                    </ul>
                </div>
            </div>

            <div style={styles.reflectionSection}>
                <h3 style={styles.cardTitle}>Quick Reflection</h3>
                <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Which sentence was hardest to write? Why?</p>
                <textarea
                    style={styles.reflectionInput}
                    placeholder="I struggled with..."
                />
            </div>

            <div style={styles.footer}>
                <button style={styles.homeButton} onClick={onReset}>
                    Back to Teacher Console
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        width: '100%',
    },
    title: {
        fontSize: '2rem',
        textAlign: 'center',
        color: 'var(--text-primary)',
    },
    subtitle: {
        textAlign: 'center',
        color: 'var(--text-secondary)',
        marginTop: '-1.5rem',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
    },
    card: {
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 'var(--radius-sm)',
        padding: '1.5rem',
        border: '1px solid var(--glass-border)',
    },
    cardTitle: {
        fontSize: '1rem',
        color: 'var(--text-accent)',
        marginBottom: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    textPreview: {
        fontStyle: 'italic',
        lineHeight: '1.6',
        color: 'var(--text-secondary)',
    },
    list: {
        paddingLeft: '1.2rem',
        lineHeight: '1.8',
        color: 'var(--text-primary)',
    },
    reflectionSection: {
        marginTop: '1rem',
    },
    reflectionInput: {
        width: '100%',
        background: 'rgba(0,0,0,0.2)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-sm)',
        padding: '1rem',
        color: 'white',
        fontFamily: 'var(--font-body)',
        minHeight: '80px',
    },
    footer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '1rem',
    },
    homeButton: {
        background: 'transparent',
        border: '1px solid var(--primary-color)',
        color: 'var(--primary-color)',
        padding: '0.75rem 2rem',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.2s',
    }
};

export default ReflectionView;
