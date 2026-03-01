import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON request bodies

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'AI Chatbot API is running!' });
});

// Chat endpoint - handles user messages and returns AI responses
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
    const response = await result.response;
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
    
    if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please try again later.' 
      });
    }

    // Generic error response
    res.status(500).json({ 
      error: 'An error occurred while processing your request.' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 Chat endpoint: POST http://localhost:${PORT}/chat`);
});
