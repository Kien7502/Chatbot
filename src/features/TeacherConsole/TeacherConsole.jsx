import React, { useState } from 'react';

const TeacherConsole = ({ onStart }) => {
    const [formData, setFormData] = useState({
        topic: 'Funding the Arts',
        vocabulary: 'subsidize, vital, cultural heritage, taxpayer',
        constraint: 'Write 3 sentences explaining one reason why governments should fund the arts. Do not use examples yet.',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onStart(formData);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Session Configuration</h2>
            <p style={styles.subtitle}>Define the scope for today's micro-writing practice.</p>

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Class Topic</label>
                    <input
                        type="text"
                        name="topic"
                        value={formData.topic}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="e.g. Environmental Policy"
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Target Vocabulary</label>
                    <input
                        type="text"
                        name="vocabulary"
                        value={formData.vocabulary}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="Comma separated words"
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Prompt / Constraint</label>
                    <textarea
                        name="constraint"
                        value={formData.constraint}
                        onChange={handleChange}
                        style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
                        placeholder="Describe the task..."
                    />
                </div>

                <div style={styles.actions}>
                    <button type="submit" style={styles.button}>
                        Initialize Session
                    </button>
                </div>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        width: '100%',
    },
    title: {
        fontSize: '2rem',
        marginBottom: '0.5rem',
        color: 'var(--text-primary)',
    },
    subtitle: {
        color: 'var(--text-secondary)',
        marginBottom: '2rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontSize: '0.9rem',
        fontWeight: '500',
        color: 'var(--text-accent)',
    },
    input: {
        background: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.75rem',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-body)',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    actions: {
        marginTop: '1rem',
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        background: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        padding: '0.75rem 2rem',
        borderRadius: 'var(--radius-sm)',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background 0.2s, transform 0.1s',
    },
};

export default TeacherConsole;
