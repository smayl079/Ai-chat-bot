// Retrieval Service - Retrieves relevant chunks for RAG
import { databaseService } from './database.service.js';
import { embeddingService } from './embedding.service.js';
import { geminiConfig } from '../config/gemini.js';
import { logger } from '../utils/logger.js';

class RetrievalService {
  /**
   * Retrieve relevant chunks for a question (keyword-based fallback)
   * This is used when pgvector is not available
   */
  async retrieveKeywordBased(websiteId, question) {
    try {
      logger.info(`Retrieving chunks (keyword-based) for website ${websiteId}`);

      // Extract keywords from question (remove common words)
      const stopWords = new Set(['what', 'how', 'when', 'where', 'who', 'why', 'is', 'are', 'the', 'a', 'an', 'do', 'does', 'can', 'could', 'would', 'should']);
      const keywords = question
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.has(word))
        .join(' ');

      logger.debug(`Extracted keywords: "${keywords}"`);

      // Search chunks by keywords
      const chunks = await databaseService.searchChunksByKeyword(
        websiteId,
        keywords,
        geminiConfig.maxChunksToRetrieve
      );

      logger.info(`Retrieved ${chunks.length} relevant chunks`);

      return chunks;
    } catch (error) {
      logger.error('Error in keyword-based retrieval:', error);
      throw error;
    }
  }

  /**
   * Retrieve relevant chunks using embeddings and cosine similarity
   * This is used when embeddings are available (future enhancement)
   */
  async retrieveEmbeddingBased(websiteId, question) {
    try {
      logger.info(`Retrieving chunks (embedding-based) for website ${websiteId}`);

      // Generate embedding for the question
      const questionEmbedding = await embeddingService.generateEmbedding(question);

      // Get all chunks for the website
      const allChunks = await databaseService.getChunksForWebsite(websiteId);

      if (allChunks.length === 0) {
        logger.warn(`No chunks found for website ${websiteId}`);
        return [];
      }

      // NOTE: This requires embeddings to be pre-computed and stored
      // For now, we'll fall back to keyword-based search
      logger.warn('Embedding-based retrieval not yet implemented. Falling back to keyword search.');

      return await this.retrieveKeywordBased(websiteId, question);
    } catch (error) {
      logger.error('Error in embedding-based retrieval:', error);
      // Fallback to keyword search
      return await this.retrieveKeywordBased(websiteId, question);
    }
  }

  /**
   * Main retrieval method
   * Automatically chooses best available retrieval strategy
   */
  async retrieve(websiteId, question) {
    try {
      // For now, use keyword-based retrieval
      // TODO: Implement embedding-based retrieval when embeddings are stored
      return await this.retrieveKeywordBased(websiteId, question);
    } catch (error) {
      logger.error('Error in retrieval:', error);
      throw error;
    }
  }

  /**
   * Get additional context (FAQs, services, contact)
   */
  async getAdditionalContext(websiteId, question) {
    try {
      // Check if question is about pricing, services, or contact
      const lowerQuestion = question.toLowerCase();
      const context = {};

      // Get FAQs if question seems like a FAQ
      if (lowerQuestion.includes('how') || lowerQuestion.includes('what') || lowerQuestion.includes('?')) {
        const faqs = await databaseService.searchFAQs(websiteId, question);
        if (faqs.length > 0) {
          context.faqs = faqs;
        }
      }

      // Get services if question is about services or pricing
      if (lowerQuestion.includes('service') || lowerQuestion.includes('price') || lowerQuestion.includes('cost') || lowerQuestion.includes('offer')) {
        const services = await databaseService.getServices(websiteId);
        if (services.length > 0) {
          context.services = services.slice(0, 5); // Limit to 5 services
        }
      }

      // Get contact info if question is about contact or hours
      if (lowerQuestion.includes('contact') || lowerQuestion.includes('phone') || lowerQuestion.includes('email') || lowerQuestion.includes('hours') || lowerQuestion.includes('address')) {
        const contactInfo = await databaseService.getContactInfo(websiteId);
        if (contactInfo) {
          context.contactInfo = contactInfo;
        }
      }

      return context;
    } catch (error) {
      logger.error('Error getting additional context:', error);
      return {};
    }
  }
}

export const retrievalService = new RetrievalService();
