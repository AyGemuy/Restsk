// pages/index.js
'use client';

import { useState } from 'react';

const GptPage = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    const sendMessage = async () => {
        if (message.trim()) {
            setMessages([...messages, { user: true, text: message }]);
            setMessage('');
            setIsTyping(true);
            try {
                const res = await fetch(`/api/ai/gpt4v?prompt=${encodeURIComponent(message)}`);
                if (!res.ok) {
                    throw new Error(`Failed to fetch: ${res.status}`);
                }
                const data = (await res.json())?.result;
                const aiResponse = data?.message || "Gpt tidak memiliki respons.";
                setMessages(prevMessages => [
                    ...prevMessages,
                    { user: false, text: aiResponse },
                ]);
            } catch (error) {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { user: false, text: 'Terjadi kesalahan saat mendapatkan respons.' },
                ]);
                console.error('Error fetching API:', error);
            } finally {
                setIsTyping(false);
            }
        }
    };

    return (
        <div style={styles.chatContainer}>
            <header style={styles.chatHeader}>
                <div style={styles.botStatus}>
                    <h2 style={styles.botName}>AI Assistant</h2>
                    <p style={styles.statusText}>
                        {isTyping ? 'Mengetik...' : 'Online - Ready to help'}
                    </p>
                </div>
            </header>

            <div style={styles.chatMessages}>
                {messages.length === 0 ? (
                    <div style={styles.emptyMessage}>Belum ada percakapan. Mulai chat sekarang!</div>
                ) : (
                    messages.map((msg, idx) => (
                        <div
                            key={idx}
                            style={{
                                ...styles.messageGroup,
                                alignSelf: msg.user ? 'flex-end' : 'flex-start',
                            }}
                        >
                            <div style={styles.messageContainer}>
                                <div
                                    style={{
                                        ...styles.messageAvatar,
                                        backgroundColor: msg.user ? '#4F46E5' : '#1F2937',
                                    }}
                                >
                                    <span style={{ fontSize: '18px' }}>{msg.user ? '👤' : '🤖'}</span>
                                </div>
                                <div
                                    style={{
                                        ...styles.message,
                                        backgroundColor: msg.user ? '#4F46E5' : '#1F2937',
                                    }}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div style={styles.chatInput}>
                <div style={styles.inputContainer}>
                    <input
                        type="text"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Ketik pesan Anda di sini..."
                        style={styles.input}
                    />
                    <button onClick={sendMessage} style={styles.sendButton}>Kirim</button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    chatContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#1F2937',
        color: '#E5E7EB',
        fontFamily: 'Segoe UI, Roboto, sans-serif',
    },
    chatHeader: {
        padding: '16px',
        background: '#2D3748',
        borderBottom: '1px solid #4A5568',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    botStatus: {
        display: 'flex',
        flexDirection: 'column',
    },
    botName: {
        fontSize: '18px',
        fontWeight: '600',
    },
    statusText: {
        fontSize: '14px',
        color: '#A0AEC0',
    },
    chatMessages: {
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    emptyMessage: {
        textAlign: 'center',
        color: '#A0AEC0',
        fontSize: '16px',
    },
    messageGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        maxWidth: '80%',
        opacity: 0,
        transform: 'translateY(10px)',
        animation: 'messageAppear 0.3s forwards',
    },
    messageContainer: {
        display: 'flex',
        gap: '8px',
    },
    messageAvatar: {
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
    },
    message: {
        padding: '10px 14px',
        borderRadius: '16px',
        fontSize: '14px',
        lineHeight: '1.4',
        wordWrap: 'break-word',
    },
    chatInput: {
        padding: '12px 16px',
        background: '#2D3748',
        borderTop: '1px solid #4A5568',
    },
    inputContainer: {
        display: 'flex',
        gap: '8px',
    },
    input: {
        flex: '1',
        background: '#4A5568',
        border: 'none',
        outline: 'none',
        color: '#E5E7EB',
        fontSize: '14px',
        padding: '8px',
        borderRadius: '8px',
    },
    sendButton: {
        background: '#4F46E5',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '24px',
        fontSize: '14px',
        cursor: 'pointer',
    },
};

export default GptPage;
