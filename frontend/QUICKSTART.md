# 🚀 Quick Start Guide - Resizable Chat Window

## What Was Built

A **modern, production-ready React AI chatbot interface** with comprehensive window management:

✅ **Resizable** - Drag corners/edges to resize  
✅ **Minimizable** - Collapse to header-only view  
✅ **Maximizable** - Expand to fullscreen  
✅ **State Persistence** - Remembers size and state across page refreshes  
✅ **Smooth Animations** - Professional transitions and effects  
✅ **Mobile-Friendly** - Responsive design with touch support  
✅ **Clean Code** - Well-documented, production-ready  

---

## 📁 Files Created/Modified

### New Files
- `frontend/src/components/ResizeHandler.jsx` - Resize logic and handles
- `frontend/CHATWINDOW_FEATURES.md` - Detailed feature documentation
- `frontend/QUICKSTART.md` - This file

### Modified Files
- `frontend/src/components/ChatWindow.jsx` - Added resize, minimize, maximize features
- `frontend/src/components/ChatWindow.css` - Added styles for all states and handles

---

## 🎮 How to Use

### Starting the App

```bash
# If not already installed
cd frontend
npm install

# Start the development server
npm run dev
```

The frontend will run at `http://localhost:5173` (or another port if 5173 is busy)

### Interacting with the Chat Window

#### 1. **Resizing**
- **Drag Corners**: Click and drag any corner (NW, NE, SW, SE) to resize diagonally
- **Drag Edges**: Click and drag any edge (N, S, E, W) to resize in one direction
- Your cursor will change to indicate resize direction
- Minimum size: 320×400px
- Maximum size: 1200×900px (or viewport size)

#### 2. **Minimizing**
- Click the **minimize button** (horizontal line icon) in the header
- Window collapses to show only the header
- Click again to restore

#### 3. **Maximizing**
- Click the **maximize button** (square icon) in the header
- Window expands to fill the entire viewport
- Click again to restore to previous size
- **OR** double-click the header to toggle maximize/restore

#### 4. **Closing**
- Click the **X button** to close the chat window
- Your size and state preferences are preserved
- Click the chat button to reopen with previous settings

#### 5. **State Persistence**
- Refresh the page - your window size and state are remembered
- Close and reopen - settings persist
- Clear browser data to reset to defaults

---

## 🎨 Customization

### Change Default Size

Edit `frontend/src/components/ChatWindow.jsx`:

```jsx
// Around line 18
const DEFAULT_SIZE = { width: 450, height: 600 }; // Your custom size
```

### Change Min/Max Constraints

```jsx
// Around lines 19-20
const MIN_SIZE = { width: 280, height: 350 };
const MAX_SIZE = { width: 1500, height: 1000 };
```

### Change Colors

Edit `frontend/src/components/ChatWindow.css`:

```css
/* Header gradient - around line 144 */
.chat-header {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}

/* User message bubbles - around line 296 */
.message.user .message-content {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}
```

### Change Position

Edit the fixed position in `frontend/src/components/ChatWindow.css`:

```css
.chat-window {
  /* Change these values */
  bottom: 100px;  /* Distance from bottom */
  right: 30px;    /* Distance from right */
}
```

---

## 🧪 Testing

### Manual Test Checklist

Open the app and verify:

- [ ] Click chat button to open window
- [ ] Drag bottom-right corner to resize
- [ ] Drag top-left corner to resize
- [ ] Drag right edge to make wider
- [ ] Drag bottom edge to make taller
- [ ] Click minimize - only header shows
- [ ] Click minimize again - window restores
- [ ] Click maximize - fills viewport
- [ ] Double-click header - toggles maximize
- [ ] Resize window to custom size
- [ ] Refresh page - size is remembered
- [ ] Close and reopen - settings persist
- [ ] Send a message - scrolling works
- [ ] Resize while messages visible - no breaking

### Browser Testing

Test in:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (Mac/iOS)
- ✅ Mobile browsers (responsive design)

---

## 🐛 Troubleshooting

### Window not resizing?
- Make sure you're dragging the corners or edges, not the header
- Check that the window is in "normal" state (not minimized or maximized)
- Cursor should change when hovering over resize handles

### State not persisting?
- Check browser console for localStorage errors
- Ensure localStorage is enabled in browser settings
- Try clearing cache and localStorage: `localStorage.clear()`

### Can't see resize handles?
- They're invisible by default but functional
- Hover near corners/edges - cursor will change
- On mobile, only corner handles are available

### Window too large/small?
- Reset by clearing localStorage: Open console and run:
  ```javascript
  localStorage.removeItem('chatWindowSize');
  localStorage.removeItem('chatWindowState');
  location.reload();
  ```

---

## 📚 Additional Documentation

For detailed technical documentation, see:
- `CHATWINDOW_FEATURES.md` - Complete feature list and architecture
- `ChatWindow.jsx` - Inline code comments
- `ResizeHandler.jsx` - Resize logic documentation

---

## 🎯 Next Steps

### Recommended Enhancements
1. **Drag to Move**: Add draggable header to reposition window
2. **Themes**: Add light/dark mode toggle
3. **Animations**: Add more entrance/exit animations
4. **Keyboard Shortcuts**: Add hotkeys for minimize/maximize
5. **Position Persistence**: Save window X/Y coordinates

### Integration
- Connect to your backend API (already implemented in sendMessage)
- Add authentication if needed
- Customize messages and styling
- Add file upload capability
- Implement typing indicators from server

---

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Review the detailed documentation in `CHATWINDOW_FEATURES.md`
3. Inspect the code comments in the component files
4. Clear localStorage and try again

**Built with ❤️ using React, modern CSS, and clean architecture principles**
