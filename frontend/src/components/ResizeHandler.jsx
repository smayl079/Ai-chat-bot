import { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * ResizeHandler Hook
 * 
 * Handles window resizing with mouse and touch support
 * - Drag corners or edges to resize
 * - Enforces min/max dimensions
 * - Prevents resizing beyond viewport bounds
 * - Smooth cursor indicators
 * 
 * @param {Object} windowRef - Ref to the window element
 * @param {Object} size - Current size {width, height}
 * @param {Function} setSize - Function to update size
 * @param {Object} minSize - Minimum dimensions {width, height}
 * @param {Object} maxSize - Maximum dimensions {width, height}
 * @param {string} windowState - Current state (normal/minimized/maximized)
 */
export const useResizeHandler = (windowRef, size, setSize, minSize, maxSize, windowState) => {
  useEffect(() => {
    // Only enable resizing when window is in normal state
    if (windowState !== 'normal') return;

    const handleMouseMove = (e) => {
      if (!windowRef.current?.dataset.resizing) return;

      const direction = windowRef.current.dataset.resizeDirection;
      const startX = Number.parseFloat(windowRef.current.dataset.startX);
      const startY = Number.parseFloat(windowRef.current.dataset.startY);
      const startWidth = Number.parseFloat(windowRef.current.dataset.startWidth);
      const startHeight = Number.parseFloat(windowRef.current.dataset.startHeight);
      const windowRight = Number.parseFloat(windowRef.current.dataset.windowRight);
      const windowBottom = Number.parseFloat(windowRef.current.dataset.windowBottom);

      let newWidth = startWidth;
      let newHeight = startHeight;

      // Calculate new dimensions based on direction
      if (direction.includes('e')) {
        // East (right edge)
        newWidth = startWidth + (e.clientX - startX);
      }
      if (direction.includes('w')) {
        // West (left edge)
        const deltaX = startX - e.clientX;
        newWidth = startWidth + deltaX;
        // Check if we're going beyond the right edge
        if (windowRight - newWidth < 0) {
          newWidth = windowRight;
        }
      }
      if (direction.includes('s')) {
        // South (bottom edge)
        newHeight = startHeight + (e.clientY - startY);
      }
      if (direction.includes('n')) {
        // North (top edge)
        const deltaY = startY - e.clientY;
        newHeight = startHeight + deltaY;
        // Check if we're going beyond the bottom edge
        if (windowBottom - newHeight < 0) {
          newHeight = windowBottom;
        }
      }

      // Enforce minimum dimensions
      newWidth = Math.max(minSize.width, newWidth);
      newHeight = Math.max(minSize.height, newHeight);

      // Enforce maximum dimensions (viewport bounds)
      const maxWidth = Math.min(maxSize.width, window.innerWidth - 20);
      const maxHeight = Math.min(maxSize.height, window.innerHeight - 20);
      newWidth = Math.min(maxWidth, newWidth);
      newHeight = Math.min(maxHeight, newHeight);

      setSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      if (windowRef.current) {
        delete windowRef.current.dataset.resizing;
        delete windowRef.current.dataset.resizeDirection;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [windowRef, setSize, minSize, maxSize, windowState]);

  const startResize = useCallback((e, direction) => {
    e.preventDefault();
    e.stopPropagation();

    if (!windowRef.current) return;

    const rect = windowRef.current.getBoundingClientRect();
    
    // Store initial values in dataset
    windowRef.current.dataset.resizing = 'true';
    windowRef.current.dataset.resizeDirection = direction;
    windowRef.current.dataset.startX = e.clientX;
    windowRef.current.dataset.startY = e.clientY;
    windowRef.current.dataset.startWidth = size.width;
    windowRef.current.dataset.startHeight = size.height;
    windowRef.current.dataset.windowRight = rect.right;
    windowRef.current.dataset.windowBottom = rect.bottom;

    // Set cursor for the entire document
    const cursorMap = {
      'n': 'ns-resize',
      's': 'ns-resize',
      'e': 'ew-resize',
      'w': 'ew-resize',
      'ne': 'nesw-resize',
      'nw': 'nwse-resize',
      'se': 'nwse-resize',
      'sw': 'nesw-resize'
    };
    document.body.style.cursor = cursorMap[direction];
    document.body.style.userSelect = 'none';
  }, [windowRef, size]);

  return { startResize };
};

/**
 * ResizeHandles Component
 * 
 * Renders resize handles on corners and edges
 * Provides visual feedback and drag functionality
 * 
 * Note: These use div elements instead of buttons because they need
 * absolute positioning and special cursor behavior for drag interactions.
 */
export const ResizeHandles = ({ onResize, windowState }) => {
  // Don't show resize handles when minimized or maximized
  if (windowState !== 'normal') return null;

  return (
    <>
      {/* Corner Handles */}
      {/* eslint-disable jsx-a11y/prefer-tag-over-role */}
      <div 
        className="resize-handle corner nw" 
        onMouseDown={(e) => onResize(e, 'nw')}
        role="button"
        tabIndex={0}
        aria-label="Resize window from top-left corner"
        title="Resize"
      />
      <div 
        className="resize-handle corner ne" 
        onMouseDown={(e) => onResize(e, 'ne')}
        role="button"
        tabIndex={0}
        aria-label="Resize window from top-right corner"
        title="Resize"
      />
      <div 
        className="resize-handle corner sw" 
        onMouseDown={(e) => onResize(e, 'sw')}
        role="button"
        tabIndex={0}
        aria-label="Resize window from bottom-left corner"
        title="Resize"
      />
      <div 
        className="resize-handle corner se" 
        onMouseDown={(e) => onResize(e, 'se')}
        role="button"
        tabIndex={0}
        aria-label="Resize window from bottom-right corner"
        title="Resize"
      />

      {/* Edge Handles */}
      <div 
        className="resize-handle edge n" 
        onMouseDown={(e) => onResize(e, 'n')}
        role="button"
        tabIndex={0}
        aria-label="Resize window from top edge"
      />
      <div 
        className="resize-handle edge s" 
        onMouseDown={(e) => onResize(e, 's')}
        role="button"
        tabIndex={0}
        aria-label="Resize window from bottom edge"
      />
      <div 
        className="resize-handle edge e" 
        onMouseDown={(e) => onResize(e, 'e')}
        role="button"
        tabIndex={0}
        aria-label="Resize window from right edge"
      />
      <div 
        className="resize-handle edge w" 
        onMouseDown={(e) => onResize(e, 'w')}
        role="button"
        tabIndex={0}
        aria-label="Resize window from left edge"
      />
      {/* eslint-enable jsx-a11y/prefer-tag-over-role */}
    </>
  );
};

ResizeHandles.propTypes = {
  onResize: PropTypes.func.isRequired,
  windowState: PropTypes.oneOf(['normal', 'minimized', 'maximized']).isRequired,
};
