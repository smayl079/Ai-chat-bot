// Chat API Routes
import express from 'express';
import { chatController } from '../controllers/chat.controller.js';
import { validateChatRequest } from '../middleware/validation.middleware.js';

const router = express.Router();

/**
 * POST /api/chat
 * Main chatbot endpoint - processes user message and returns AI response
 */
router.post('/chat', validateChatRequest, chatController);

/**
 * GET /api/websites
 * Get list of available websites (for testing/debugging)
 */
router.get('/websites', async (req, res) => {
  try {
    const { databaseService } = await import('../services/database.service.js');
    const websites = await databaseService.getAllWebsites();
    res.json({
      success: true,
      count: websites.length,
      websites: websites.map(w => ({
        id: w.id,
        name: w.name,
        domain: w.domain,
        businessType: w.businessType,
        chatbotName: w.chatbotName
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/website/:id
 * Get specific website details
 */
router.get('/website/:id', async (req, res) => {
  try {
    const { databaseService } = await import('../services/database.service.js');
    const websiteId = parseInt(req.params.id);
    const website = await databaseService.getWebsiteById(websiteId);
    
    if (!website) {
      return res.status(404).json({
        success: false,
        error: 'Website not found'
      });
    }
    
    res.json({
      success: true,
      website: {
        id: website.id,
        name: website.name,
        domain: website.domain,
        businessType: website.businessType,
        chatbotName: website.chatbotName,
        language: website.language
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
