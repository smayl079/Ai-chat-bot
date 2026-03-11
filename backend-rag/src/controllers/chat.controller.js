// Chat Controller - Handles chat API requests
import { chatService } from '../services/chat.service.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../utils/errors.js';

/**
 * Main chat controller
 * Processes user message and returns AI-generated response
 */
export async function chatController(req, res, next) {
  try {
    const { websiteId, message } = req.body;
    
    logger.info(`Chat request received - WebsiteID: ${websiteId}, Message: "${message}"`);
    
    // Process chat message through RAG pipeline
    const startTime = Date.now();
    const result = await chatService.processChat(websiteId, message);
    const processingTime = Date.now() - startTime;
    
    logger.info(`Chat response generated in ${processingTime}ms`);
    
    // Return response
    res.json({
      success: true,
      answer: result.answer,
      sources: result.sources,
      metadata: {
        websiteId,
        websiteName: result.websiteName,
        chunksRetrieved: result.chunksRetrieved,
        processingTimeMs: processingTime
      }
    });
    
  } catch (error) {
    logger.error('Chat controller error:', error);
    
    // Handle specific error types
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.message,
        code: error.code
      });
    }
    
    // Generic error
    res.status(500).json({
      success: false,
      error: 'An error occurred while processing your message',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
