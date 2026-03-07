import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatSession } from './chat-function.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Store chat sessions per user (in production, use proper session management)
const chatSessions = new Map();

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON request bodies

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'AI Chatbot API is running!' });
});

// Chat endpoint - handles user messages and returns AI responses (stateless)
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // Validate input
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid request. Message is required.' 
      });
    }

    // Check if API key is configured
    if (!process.env.GOOGLE_API_KEY) {
      return res.status(500).json({ 
        error: 'Google API key is not configured.' 
      });
    }

    // Call Google Gemini API
    const result = await model.generateContent(message);
    const response = result.response;
    const aiResponse = response.text();

    // Send response back to frontend
    res.json({ 
      response: aiResponse,
      success: true 
    });

  } catch (error) {
    console.error('Error in /chat endpoint:', error);
    
    // Handle specific Google API errors
    if (error.message?.includes('API key') || error.message?.includes('invalid')) {
      return res.status(401).json({ 
        error: 'Invalid Google API key.' 
      });
    }
    
    // Check for rate limit errors
    if (error.message?.includes('quota') || 
        error.message?.includes('rate limit') ||
        error.message?.includes('429') ||
        error.message?.includes('RESOURCE_EXHAUSTED') ||
        error.status === 429) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please wait a moment and try again.' 
      });
    }

    // Generic error response
    res.status(500).json({ 
      error: 'An error occurred while processing your request.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Chat endpoint with conversation history
app.post('/chat-session', async (req, res) => {
  try {
    const { message, sessionId = 'default' } = req.body;

    // Validate input
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid request. Message is required.' 
      });
    }

    // Check if API key is configured
    if (!process.env.GOOGLE_API_KEY) {
      return res.status(500).json({ 
        error: 'Google API key is not configured.' 
      });
    }

    // Get or create chat session for this user
    let chatSession = chatSessions.get(sessionId);
    if (!chatSession) {
      chatSession = new ChatSession();
      chatSessions.set(sessionId, chatSession);
    }

    // Send message and get response
    const aiResponse = await chatSession.sendMessage(message);

    // Send response back to frontend
    res.json({ 
      response: aiResponse,
      success: true,
      historyLength: chatSession.getHistory().length
    });

  } catch (error) {
    console.error('Error in /chat-session endpoint:', error);
    
    // Handle specific Google API errors
    if (error.message?.includes('API key') || error.message?.includes('invalid')) {
      return res.status(401).json({ 
        error: 'Invalid Google API key.' 
      });
    }
    
    // Check for rate limit errors (multiple patterns)
    if (error.message?.includes('quota') || 
        error.message?.includes('rate limit') ||
        error.message?.includes('429') ||
        error.message?.includes('RESOURCE_EXHAUSTED') ||
        error.status === 429) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please wait a moment and try again.' 
      });
    }

    // Generic error response
    res.status(500).json({ 
      error: 'An error occurred while processing your request.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get chat history for a session
app.get('/chat-session/:sessionId/history', (req, res) => {
  const { sessionId } = req.params;
  const chatSession = chatSessions.get(sessionId);
  
  if (!chatSession) {
    return res.status(404).json({ 
      error: 'Session not found' 
    });
  }

  res.json({
    history: chatSession.getHistory(),
    formattedHistory: chatSession.getFormattedHistory()
  });
});

// Clear chat history for a session
app.delete('/chat-session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const chatSession = chatSessions.get(sessionId);
  
  if (!chatSession) {
    return res.status(404).json({ 
      error: 'Session not found' 
    });
  }

  chatSession.clearHistory();
  chatSessions.delete(sessionId);
  
  res.json({ 
    success: true,
    message: 'Chat session cleared' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 Endpoints:`);
  console.log(`   POST /chat - Stateless chat (no history)`);
  console.log(`   POST /chat-session - Chat with conversation history`);
  console.log(`   GET /chat-session/:sessionId/history - Get chat history`);
  console.log(`   DELETE /chat-session/:sessionId - Clear chat history`);
});
