import React, { useState } from 'react';
import ChatButton from './components/ChatButton';
import ChatWindow from './components/ChatWindow';
import './App.css';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="app">
      {/* Main Content Area - Full White Background */}
      <div className="main-content">
        <div className="content-center">
          <h1>Welcome to Our Platform</h1>
          <p>Clean, minimal, and modern design</p>
        </div>
      </div>

      {/* Floating Chat Components */}
      <ChatButton onClick={toggleChat} isOpen={isChatOpen} />
      {isChatOpen && <ChatWindow onClose={toggleChat} />}
    </div>
  );
}

export default App;
