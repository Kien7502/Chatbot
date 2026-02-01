import React, { useState, useEffect, useRef } from 'react';
import { getPedagogicalFeedback } from '../../services/gemini';

const WritingSession = ({ sessionData, onComplete }) => {
    const [text, setText] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: `Hi! I'm here to help you practice. Let's start with the prompt above.`, timestamp: new Date() }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    // Auto-scroll chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const handleFinish = () => {
        onComplete({ text, messages });
    };

    // call Gemini
    const requestHelp = async () => {
        if (isLoading) return;
        setIsLoading(true);

        // Optimistic UI for loading
        const loadingId = Date.now();

        try {
            const aiResponse = await getPedagogicalFeedback(text, {
                topic: sessionData.topic,
                constraint: sessionData.constraint
            });

            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'ai',
                text: aiResponse,
                timestamp: new Date()
            }]);
        } catch (err) {
            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'ai',
                text: "I'm having a bit of trouble connecting. Try again in a moment.",
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* LEFT PANEL: Task & Editor */}
            <div style={styles.editorPanel}>
                <div style={styles.promptCard}>
                    <h3 style={styles.promptTitle}>Daily Prompt</h3>
                    <p style={styles.promptText}>{sessionData.constraint}</p>
                    <div style={styles.tags}>
                        <span style={styles.tag}>Topic: {sessionData.topic}</span>
                        <span style={styles.tag}>Vocab: {sessionData.vocabulary}</span>
                    </div>
                </div>

                <div style={styles.editorContainer}>
                    <textarea
                        style={styles.textarea}
                        placeholder="Start writing here..."
                        value={text}
                        onChange={handleTextChange}
                    />
                    <div style={styles.editorFooter}>
                        <span style={styles.wordCount}>{text.split(' ').filter(Boolean).length} words</span>
                        <button style={styles.finishButton} onClick={handleFinish}>
                            Submit for Reflection
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: AI Partner */}
            <div style={styles.chatPanel}>
                <div style={styles.chatHeader}>
                    <div style={styles.aiAvatar}>AI</div>
                    <span>Writing Partner</span>
                </div>

                <div style={styles.messages} ref={scrollRef}>
                    {messages.map(msg => (
                        <div key={msg.id} style={{
                            ...styles.messageBubble,
                            alignSelf: msg.sender === 'ai' ? 'flex-start' : 'flex-end',
                            background: msg.sender === 'ai' ? 'rgba(255,255,255,0.1)' : 'var(--primary-color)',
                        }}>
                            {msg.text}
                        </div>
                    ))}
                    {isLoading && (
                        <div style={{ ...styles.messageBubble, alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)' }}>
                            <em>Typing...</em>
                        </div>
                    )}
                </div>

                <div style={styles.chatInputArea}>
                    <button
                        style={{ ...styles.helpButton, opacity: isLoading ? 0.5 : 1 }}
                        onClick={requestHelp}
                        disabled={isLoading}
                    >
                        {isLoading ? 'THINKING...' : 'STUCK? GET A HINT'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        gap: '2rem',
        height: '600px', // Fixed height for the session view
        width: '100%',
    },
    editorPanel: {
        flex: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    chatPanel: {
        flex: 1,
        background: 'rgba(0,0,0,0.2)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    promptCard: {
        background: 'var(--glass-bg)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--glass-border)',
    },
    promptTitle: {
        fontSize: '0.85rem',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: 'var(--text-accent)',
        marginBottom: '0.5rem',
    },
    promptText: {
        fontSize: '1.1rem',
        lineHeight: '1.5',
        marginBottom: '1rem',
    },
    tags: {
        display: 'flex',
        gap: '0.5rem',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
    },
    tag: {
        background: 'rgba(255,255,255,0.05)',
        padding: '0.2rem 0.5rem',
        borderRadius: '4px',
    },
    editorContainer: {
        flex: 1,
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
    },
    textarea: {
        flex: 1,
        background: 'transparent',
        border: 'none',
        color: 'var(--text-primary)',
        padding: '1.5rem',
        fontSize: '1.1rem',
        fontFamily: 'var(--font-body)',
        lineHeight: '1.6',
        resize: 'none',
        outline: 'none',
    },
    editorFooter: {
        padding: '1rem',
        borderTop: '1px solid var(--glass-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    wordCount: {
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
    },
    finishButton: {
        background: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1.5rem',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        fontWeight: '600',
    },
    chatHeader: {
        padding: '1rem',
        background: 'rgba(0,0,0,0.2)',
        borderBottom: '1px solid var(--glass-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontWeight: '600',
        fontSize: '0.9rem',
    },
    aiAvatar: {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: 'var(--text-accent)',
        color: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.7rem',
        fontWeight: 'bold',
    },
    messages: {
        flex: 1,
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        overflowY: 'auto',
    },
    messageBubble: {
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        fontSize: '0.9rem',
        marginBottom: '4px',
        maxWidth: '85%',
        lineHeight: '1.4',
    },
    chatInputArea: {
        padding: '1rem',
        borderTop: '1px solid var(--glass-border)',
    },
    helpButton: {
        width: '100%',
        padding: '0.75rem',
        background: 'transparent',
        border: '1px dashed var(--text-accent)',
        color: 'var(--text-accent)',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        fontSize: '0.8rem',
        fontWeight: '600',
        transition: 'all 0.2s',
    }
};

export default WritingSession;
