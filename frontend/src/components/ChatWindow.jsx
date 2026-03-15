import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ChatWindow.css';

/**
 * ChatWindow Component
 * 
 * A modern, resizable chat interface with:
 * - Resize by dragging corners/edges
 * - Minimize/restore functionality
 * - Maximize to fullscreen
 * - Double-click header to toggle maximize
 * - State persistence in localStorage
 * - Smooth animations
 */
const ChatWindow = ({ onClose }) => {
  // Default dimensions
  const DEFAULT_SIZE = { width: 380, height: 550 };

  // Chat messages state
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0); // Track cooldown timer
  
  // Generate unique session ID for this page session (persists while page is open)
  const [sessionId] = useState(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  });
  
  // Window state management
  const [windowState, setWindowState] = useState('normal'); // 'normal' | 'minimized' | 'maximized'
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [previousSize, setPreviousSize] = useState(DEFAULT_SIZE); // Store size before maximize
  
  const messagesEndRef = useRef(null);
  const windowRef = useRef(null);
  const textareaRef = useRef(null);
  const lastMessageTimeRef = useRef(0);
  // Gemini 2.5 Flash has 5 RPM limit = 12 seconds between requests
  // Frontend enforces 15 seconds to be extra safe and account for network delays
  const MIN_MESSAGE_INTERVAL = 15000; // 15 seconds between messages

  /**
   * Load saved state from localStorage on mount
   */
  useEffect(() => {
    const savedState = localStorage.getItem('chatWindowState');
    const savedSize = localStorage.getItem('chatWindowSize');

    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setWindowState(state.windowState || 'normal');
      } catch (error) {
        console.warn('Failed to parse saved window state:', error);
      }
    }

    if (savedSize) {
      try {
        const parsedSize = JSON.parse(savedSize);
        setSize(parsedSize);
        setPreviousSize(parsedSize);
      } catch (error) {
        console.warn('Failed to parse saved window size:', error);
      }
    }
  }, []);

  /**
   * Save state to localStorage whenever it changes
   */
  useEffect(() => {
    localStorage.setItem('chatWindowState', JSON.stringify({ windowState }));
  }, [windowState]);

  useEffect(() => {
    // Only save size when in normal state
    if (windowState === 'normal') {
      localStorage.setItem('chatWindowSize', JSON.stringify(size));
    }
  }, [size, windowState]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea as user types
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [inputMessage]);

  // Update cooldown timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastMessage = now - lastMessageTimeRef.current;
      if (timeSinceLastMessage < MIN_MESSAGE_INTERVAL) {
        const remaining = Math.ceil((MIN_MESSAGE_INTERVAL - timeSinceLastMessage) / 1000);
        setCooldownSeconds(remaining);
      } else {
        setCooldownSeconds(0);
      }
    }, 100); // Update every 100ms for smooth countdown

    return () => clearInterval(interval);
  }, [MIN_MESSAGE_INTERVAL]);

  /**
   * Window control functions
   */
  const handleMinimize = () => {
    setWindowState(windowState === 'minimized' ? 'normal' : 'minimized');
  };

  const handleMaximize = () => {
    if (windowState === 'maximized') {
      // Restore to previous size
      setWindowState('normal');
      setSize(previousSize);
    } else {
      // Save current size and maximize
      if (windowState === 'normal') {
        setPreviousSize(size);
      }
      setWindowState('maximized');
    }
  };

  const handleHeaderDoubleClick = () => {
    handleMaximize();
  };

  // Send message to backend API
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Rate limiting: Check if enough time has passed since last message
    const now = Date.now();
    const timeSinceLastMessage = now - lastMessageTimeRef.current;
    
    if (timeSinceLastMessage < MIN_MESSAGE_INTERVAL) {
      const waitTime = Math.ceil((MIN_MESSAGE_INTERVAL - timeSinceLastMessage) / 1000);
      const warningMessage = {
        role: 'assistant',
        content: `⏱️ Please wait ${waitTime} second${waitTime > 1 ? 's' : ''} before sending another message. \n\nGemini API has a rate limit of 5 requests per minute to prevent overuse.`,
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, warningMessage]);
      return;
    }

    lastMessageTimeRef.current = now;
    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Add user message to chat
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newUserMessage]);

    // Show "AI is typing..." indicator
    setIsLoading(true);

    try {
      // Get API URL from environment variable
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // Use chat-session endpoint to maintain conversation history on backend
      const response = await fetch(`${apiUrl}/chat-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          sessionId: sessionId // Send session ID to maintain conversation history
        }),
      });

      const data = await response.json();
      const assistantReply = data.answer || data.response;

      if (response.ok && assistantReply) {
        // Add AI response to chat
        const aiMessage = {
          role: 'assistant',
          content: assistantReply,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Handle specific error codes
        let errorContent = 'Unable to get response. Please try again.';
        
        if (response.status === 429) {
          errorContent = '⚠️ Rate limit exceeded. The Gemini API has a limit of 5 requests per minute.\n\nPlease wait at least 15 seconds between messages to avoid this error.';
        } else if (response.status === 401) {
          errorContent = 'Authentication error. Please check the API key configuration.';
        } else if (data.error) {
          errorContent = data.error;
        }
        
        const errorMessage = {
          role: 'assistant',
          content: `Error: ${errorContent}`,
          timestamp: new Date(),
          isError: true,
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show error message to user
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I couldn\'t connect to the server. Please check if the backend is running.',
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Calculate window style based on state
  const getWindowStyle = () => {
    if (windowState === 'maximized') {
      return {
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        right: 'auto',
        bottom: 'auto',
        borderRadius: 0,
      };
    }
    if (windowState === 'minimized') {
      return {
        width: `${size.width}px`,
        height: 'auto', // collapsed height
      };
    }
    return {
      width: `${size.width}px`,
      height: `${size.height}px`,
    };
  };

  return (
    <div 
      ref={windowRef}
      className={`chat-window ${windowState}`}
      style={getWindowStyle()}
    >
      {/* Header */}
      {/* eslint-disable-next-line jsx-a11y/prefer-tag-over-role */}
      <div 
        className="chat-header"
        onDoubleClick={handleHeaderDoubleClick}
        role="banner"
        title="Double-click to maximize/restore"
      >
        <div className="header-content">
          <h3>AI Assistant</h3>
        </div>
        <div className="header-controls">
          <button 
            className="control-button minimize-button" 
            onClick={handleMinimize}
            aria-label={windowState === 'minimized' ? 'Restore' : 'Minimize'}
            title={windowState === 'minimized' ? 'Restore' : 'Minimize'}
          >
            {windowState === 'minimized' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            )}
          </button>
          <button 
            className="control-button maximize-button" 
            onClick={handleMaximize}
            aria-label={windowState === 'maximized' ? 'Restore' : 'Maximize'}
            title={windowState === 'maximized' ? 'Restore' : 'Fullscreen'}
          >
            {windowState === 'maximized' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="14" height="14"></rect>
                <polyline points="21 9 21 21 9 21"></polyline>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              </svg>
            )}
          </button>
          <button 
            className="control-button close-button" 
            onClick={onClose} 
            aria-label="Close chat"
            title="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area - Hidden when minimized */}
      {windowState !== 'minimized' && (
        <>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div 
                key={`${message.role}-${message.timestamp.getTime()}-${index}`} 
                className={`message ${message.role} ${message.isError ? 'error' : ''}`}
              >
                <div className="message-content">
                  {message.content}
                </div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isLoading && (
              <div className="message assistant typing">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  AI is typing...
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            <textarea
              ref={textareaRef}
              className="chat-input"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={1}
              style={{
                resize: 'none',
                minHeight: '40px',
                maxHeight: '120px',
                overflowY: 'auto'
              }}
            />
            <button 
              className="send-button"
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading || cooldownSeconds > 0}
              aria-label="Send message"
              title={cooldownSeconds > 0 ? `Wait ${cooldownSeconds}s before sending` : "Send message (Enter)"}
              style={{
                opacity: cooldownSeconds > 0 ? 0.5 : 1,
                cursor: cooldownSeconds > 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {cooldownSeconds > 0 ? (
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{cooldownSeconds}s</span>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              )}
            </button>
          </div>
          {/* Conversation info indicator */}
          <div className="chat-info" style={{
            fontSize: '10px',
            color: '#888',
            padding: '4px 12px',
            textAlign: 'center',
            borderTop: '1px solid rgba(0,0,0,0.05)'
          }}>
            💬 {messages.length} message{messages.length === 1 ? '' : 's'} • 
            ⏱️ 15s wait between messages (API limit)
          </div>
        </>
      )}
    </div>
  );
};

ChatWindow.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ChatWindow;
