import { useState, useRef, useEffect } from 'react';
import { chatService } from '../../services/chatService';
import './ChatAssistant.css';

const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'assistant',
            content: "Hi! I'm your crypto assistant. I can help explain blockchain concepts, wallet basics, and answer questions about cryptocurrency. What would you like to know?",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!inputValue.trim() || isLoading) return;

        const userMessage = {
            id: messages.length + 1,
            type: 'user',
            content: inputValue.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await chatService.sendMessage(userMessage.content);

            const assistantMessage = {
                id: messages.length + 2,
                type: 'assistant',
                content: response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                id: messages.length + 2,
                type: 'assistant',
                content: "Sorry, I'm having trouble responding right now. Please try again!",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([
            {
                id: 1,
                type: 'assistant',
                content: "Hi! I'm your crypto assistant. I can help explain blockchain concepts, wallet basics, and answer questions about cryptocurrency. What would you like to know?",
                timestamp: new Date()
            }
        ]);
        chatService.clearConversation();
    };

    const formatTime = (timestamp) => {
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (!isOpen) {
        return (
            <div className="chat-assistant">
                <button
                    className="chat-toggle-btn"
                    onClick={() => setIsOpen(true)}
                    title="Open Crypto Assistant"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 9H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 13H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Crypto Assistant</span>
                </button>
            </div>
        );
    }

    return (
        <div className="chat-assistant open">
            <div className="chat-header">
                <div className="chat-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Crypto Assistant</span>
                </div>
                <div className="chat-actions">
                    <button
                        className="clear-chat-btn"
                        onClick={clearChat}
                        title="Clear conversation"
                    >
                        🗑️
                    </button>
                    <button
                        className="close-chat-btn"
                        onClick={() => setIsOpen(false)}
                        title="Close chat"
                    >
                        ✕
                    </button>
                </div>
            </div>

            <div className="chat-messages">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`message ${message.type}`}
                    >
                        <div className="message-avatar">
                            {message.type === 'user' ? '👤' : '🤖'}
                        </div>
                        <div className="message-content">
                            <div className="message-bubble">
                                {message.content}
                            </div>
                            <div className="message-time">
                                {formatTime(message.timestamp)}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="message assistant">
                        <div className="message-avatar">🤖</div>
                        <div className="message-content">
                            <div className="message-bubble typing">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Ask me anything about crypto..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="send-btn"
                    disabled={!inputValue.trim() || isLoading}
                >
                    {isLoading ? '...' : 'Send'}
                </button>
            </form>

            <div className="chat-suggestions">
                <div className="suggestions-title">💡 Try asking:</div>
                <div className="suggestions-grid">
                    <button
                        className="suggestion-btn"
                        onClick={() => setInputValue("What is cryptocurrency?")}
                    >
                        What is crypto?
                    </button>
                    <button
                        className="suggestion-btn"
                        onClick={() => setInputValue("How does blockchain work?")}
                    >
                        How does blockchain work?
                    </button>
                    <button
                        className="suggestion-btn"
                        onClick={() => setInputValue("How to buy Bitcoin safely?")}
                    >
                        How to buy crypto safely?
                    </button>
                    <button
                        className="suggestion-btn"
                        onClick={() => setInputValue("What is a crypto wallet?")}
                    >
                        What is a wallet?
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatAssistant;
