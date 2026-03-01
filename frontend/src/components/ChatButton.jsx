import React, { useState, useEffect, useRef } from 'react';
import './ChatButton.css';

/**
 * DraggableChatButton Component
 * 
 * Features:
 * - Draggable with mouse and touch support
 * - Position persisted in localStorage
 * - Prevents click event when dragging
 * - Constrained within viewport boundaries
 * - Smooth animations and cursor feedback
 * - Default position: bottom-right corner
 */
const ChatButton = ({ onClick, isOpen }) => {
  // Button dimensions for boundary calculations
  const BUTTON_SIZE = 60;
  
  // Default position: bottom-right corner (30px padding)
  const DEFAULT_POSITION = {
    bottom: 30,
    right: 30,
    top: null,
    left: null
  };

  // State management
  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  
  const buttonRef = useRef(null);

  /**
   * Load saved position from localStorage on component mount
   */
  useEffect(() => {
    const savedPosition = localStorage.getItem('chatButtonPosition');
    if (savedPosition) {
      try {
        const parsed = JSON.parse(savedPosition);
        setPosition(parsed);
      } catch (error) {
        console.warn('Failed to parse saved position:', error);
      }
    }
  }, []);

  /**
   * Save position to localStorage whenever it changes
   */
  const savePosition = (newPosition) => {
    setPosition(newPosition);
    localStorage.setItem('chatButtonPosition', JSON.stringify(newPosition));
  };

  /**
   * Convert position to pixel coordinates for calculations
   */
  const getPixelPosition = () => {
    if (!buttonRef.current) return { x: 0, y: 0 };
    const rect = buttonRef.current.getBoundingClientRect();
    return { x: rect.left, y: rect.top };
  };

  /**
   * Constrain position within viewport boundaries
   */
  const constrainToViewport = (x, y) => {
    const maxX = window.innerWidth - BUTTON_SIZE;
    const maxY = window.innerHeight - BUTTON_SIZE;
    
    return {
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY))
    };
  };

  /**
   * Convert pixel coordinates to CSS position object
   */
  const pixelToPosition = (x, y) => {
    const constrained = constrainToViewport(x, y);
    
    // Use top/left for precise positioning during drag
    return {
      top: constrained.y,
      left: constrained.x,
      bottom: null,
      right: null
    };
  };

  /**
   * Mouse down handler - Start drag
   */
  const handleMouseDown = (e) => {
    e.preventDefault();
    const rect = buttonRef.current.getBoundingClientRect();
    
    setIsDragging(true);
    setHasMoved(false);
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  /**
   * Touch start handler - Start drag (mobile support)
   */
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const rect = buttonRef.current.getBoundingClientRect();
    
    setIsDragging(true);
    setHasMoved(false);
    setDragStart({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
  };

  /**
   * Handle drag movement (mouse and touch)
   */
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      setHasMoved(true);
      
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      setPosition(pixelToPosition(newX, newY));
    };

    const handleTouchMove = (e) => {
      e.preventDefault(); // Prevent scrolling on mobile
      setHasMoved(true);
      
      const touch = e.touches[0];
      const newX = touch.clientX - dragStart.x;
      const newY = touch.clientY - dragStart.y;
      
      setPosition(pixelToPosition(newX, newY));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      
      // Save final position to localStorage
      if (hasMoved) {
        const currentPos = getPixelPosition();
        savePosition(pixelToPosition(currentPos.x, currentPos.y));
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      
      // Save final position to localStorage
      if (hasMoved) {
        const currentPos = getPixelPosition();
        savePosition(pixelToPosition(currentPos.x, currentPos.y));
      }
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragStart, hasMoved]);

  /**
   * Handle click - Only trigger if not dragging
   */
  const handleClick = () => {
    if (!hasMoved) {
      onClick();
    }
  };

  /**
   * Build inline style from position state
   */
  const getPositionStyle = () => {
    const style = {};
    
    if (position.top !== null) style.top = `${position.top}px`;
    if (position.left !== null) style.left = `${position.left}px`;
    if (position.bottom !== null) style.bottom = `${position.bottom}px`;
    if (position.right !== null) style.right = `${position.right}px`;
    
    return style;
  };

  return (
    <button 
      ref={buttonRef}
      className={`chat-button ${isOpen ? 'open' : ''} ${isDragging ? 'dragging' : ''}`}
      style={getPositionStyle()}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      aria-label="Toggle chat"
    >
      {isOpen ? (
        // Close icon (X)
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      ) : (
        // Chat icon
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      )}
    </button>
  );
};

export default ChatButton;
