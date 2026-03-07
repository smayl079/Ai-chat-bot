import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

/**
 * Chat function with conversation history management
 * Uses Google Gemini API to maintain context across multiple messages
 * Implements rate limiting: Gemini 2.5 Flash has 5 RPM limit (12 seconds between requests)
 */
class ChatSession {
  constructor(modelName = "gemini-2.5-flash") {
    this.model = genAI.getGenerativeModel({ model: modelName });
    this.conversationHistory = [];
    this.chat = null;
    this.lastRequestTime = 0;
    this.requestQueue = [];
    this.isProcessing = false;
    // Gemini 2.5 Flash: 5 RPM = 60s / 5 = 12s minimum between requests
    // Add 1s buffer for safety = 13s
    this.minRequestInterval = 13000; // 13 seconds
  }

  /**
   * Sends a message to Gemini and maintains conversation history
   * Implements request queuing and rate limiting
   * @param {string} userMessage - The user's question/message
   * @returns {Promise<string>} - The assistant's reply
   */
  async sendMessage(userMessage, retries = 3) {
    // Enforce rate limiting: wait if needed
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      console.log(`Rate limiting: waiting ${Math.ceil(waitTime / 1000)}s before next request...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
    let lastError = null;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Initialize chat session with history if not already done
        if (!this.chat) {
          this.chat = this.model.startChat({
            history: this.conversationHistory,
            generationConfig: {
              maxOutputTokens: 1000,
              temperature: 0.7,
            },
          });
        }

        // Send message to Gemini
        const result = await this.chat.sendMessage(userMessage);
        const response = result.response;
        const assistantReply = response.text();

        // Update conversation history
        this.conversationHistory.push(
          {
            role: 'user',
            parts: [{ text: userMessage }],
          },
          {
            role: 'model',
            parts: [{ text: assistantReply }],
          }
        );

        return assistantReply;
      } catch (error) {
        lastError = error;
        
        // Check if it's a rate limit error
        const isRateLimitError = 
          error.message?.includes('429') ||
          error.message?.includes('RESOURCE_EXHAUSTED') ||
          error.message?.includes('rate limit') ||
          error.message?.includes('quota') ||
          error.status === 429;
        
        // If it's a rate limit error and we have retries left, wait and retry
        if (isRateLimitError && attempt < retries) {
          // Use longer wait times for rate limit errors
          const waitTime = Math.pow(2, attempt) * 5000; // Exponential backoff: 5s, 10s, 20s
          console.log(`Rate limit exceeded. Waiting ${waitTime / 1000}s before retry ${attempt + 1}/${retries}...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        
        // If not a rate limit error or no retries left, throw the error
        console.error('Error sending message:', error);
        throw new Error(`Failed to get response from Gemini: ${error.message}`);
      }
    }
    
    throw lastError;
  }

  /**
   * Get the current conversation history
   * @returns {Array} - Array of conversation messages
   */
  getHistory() {
    return this.conversationHistory;
  }

  /**
   * Clear the conversation history and reset chat session
   */
  clearHistory() {
    this.conversationHistory = [];
    this.chat = null;
  }

  /**
   * Get a formatted view of the conversation
   * @returns {string} - Formatted conversation string
   */
  getFormattedHistory() {
    return this.conversationHistory
      .map((msg, idx) => {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        const text = msg.parts[0].text;
        return `${idx + 1}. ${role}: ${text}`;
      })
      .join('\n\n');
  }
}

// Example usage with two questions
async function exampleUsage() {
  console.log('='.repeat(60));
  console.log('Chat Function with Conversation History - Example Usage');
  console.log('='.repeat(60));
  console.log();

  try {
    // Create a new chat session
    const chatSession = new ChatSession();

    // Question 1: Ask about a topic
    console.log('Question 1: "What is the capital of France?"');
    console.log('-'.repeat(60));
    const answer1 = await chatSession.sendMessage('What is the capital of France?');
    console.log('Assistant:', answer1);
    console.log();

    // Question 2: Follow-up question (uses conversation history)
    console.log('Question 2: "What is its population?"');
    console.log('-'.repeat(60));
    const answer2 = await chatSession.sendMessage('What is its population?');
    console.log('Assistant:', answer2);
    console.log();

    // Display full conversation history
    console.log('='.repeat(60));
    console.log('Full Conversation History:');
    console.log('='.repeat(60));
    console.log(chatSession.getFormattedHistory());
    console.log();

    // Show raw history structure
    console.log('='.repeat(60));
    console.log('Raw History Structure:');
    console.log('='.repeat(60));
    console.log(JSON.stringify(chatSession.getHistory(), null, 2));

  } catch (error) {
    console.error('Error in example usage:', error.message);
    process.exit(1);
  }
}

// Export for use in other modules
export { ChatSession };

// Run example if this file is executed directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  exampleUsage();
}
