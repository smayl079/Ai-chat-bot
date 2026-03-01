# Frontend - AI Chatbot UI

Modern React application with a floating chatbot interface.

## Features

- Clean, minimal white design
- Floating chat button with smooth animations
- Modern chat interface
- Real-time messaging with loading states
- Fully responsive design
- API integration with backend

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in this directory:

```env
VITE_API_URL=http://localhost:5000
```

## Running

### Development Server
```bash
npm run dev
```

Opens on: `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ChatButton.jsx     # Floating chat button
│   ├── ChatButton.css
│   ├── ChatWindow.jsx     # Chat interface
│   └── ChatWindow.css
├── App.jsx                # Main component
├── App.css
├── main.jsx               # Entry point
└── index.css              # Global styles
```

## Components

### ChatButton
A floating circular button that toggles the chat window.

**Props:**
- `onClick`: Function to toggle chat
- `isOpen`: Boolean indicating if chat is open

### ChatWindow
The main chat interface with messages and input.

**Props:**
- `onClose`: Function to close the chat window

## Styling

Uses pure CSS with:
- CSS Grid and Flexbox for layout
- CSS animations for smooth transitions
- Gradient backgrounds
- Responsive design with media queries

## Dependencies

- `react` - UI library
- `react-dom` - React DOM renderer
- `vite` - Build tool
- `@vitejs/plugin-react` - Vite React plugin
