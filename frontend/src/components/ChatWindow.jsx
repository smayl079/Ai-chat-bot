import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ChatWindow.css';
import { useResizeHandler, ResizeHandles } from './ResizeHandler';

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
  const MIN_SIZE = { width: 320, height: 400 };
  const MAX_SIZE = { width: 1200, height: 900 };

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
  
  // Window state management
  const [windowState, setWindowState] = useState('normal'); // 'normal' | 'minimized' | 'maximized'
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [previousSize, setPreviousSize] = useState(DEFAULT_SIZE); // Store size before maximize
  
  const messagesEndRef = useRef(null);
  const windowRef = useRef(null);

  // Initialize resize handler
  const { startResize } = useResizeHandler(
    windowRef,
    size,
    setSize,
    MIN_SIZE,
    MAX_SIZE,
    windowState
  );

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
      
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (response.ok && data.response) {
        // Add AI response to chat
        const aiMessage = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Handle error from backend
        const errorMessage = {
          role: 'assistant',
          content: `Error: ${data.error || 'Unable to get response. Please try again.'}`,
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
      {/* Resize Handles */}
      <ResizeHandles onResize={startResize} windowState={windowState} />

      {/* Header */}
      {/* eslint-disable-next-line jsx-a11y/prefer-tag-over-role */}
      <div 
        className="chat-header"
        onDoubleClick={handleHeaderDoubleClick}
        role="banner"
        title="Double-click to maximize/restore"
      >
        <div className="header-content">
          <div className="ai-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M2 12h20"/>
            </svg>
          </div>
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
            title={windowState === 'maximized' ? 'Restore' : 'Maximize'}
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
            <input
              type="text"
              className="chat-input"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button 
              className="send-button"
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              aria-label="Send message"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
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
