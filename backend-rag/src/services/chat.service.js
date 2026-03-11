// Chat Service - Main RAG orchestration
import { databaseService } from './database.service.js';
import { retrievalService } from './retrieval.service.js';
import { getChatModel } from '../config/gemini.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../utils/errors.js';

class ChatService {
  constructor() {
    this.chatModel = getChatModel();
  }

  /**
   * Build system prompt with website-specific instructions
   */
  buildSystemPrompt(website, context) {
    const basePrompt = website.systemPrompt || `You are ${website.chatbotName}, a helpful assistant for ${website.name}.`;
    
    const instructions = `
${basePrompt}

IMPORTANT INSTRUCTIONS:
- Answer ONLY using the provided context from the website database.
- Do NOT use external knowledge or make up information.
- If the answer is not found in the context, clearly say: "I don't have that information in our database."
- Be helpful, friendly, and professional.
- Provide specific details from the context when available (e.g., prices, hours, contact info).
- If multiple services or options are mentioned in context, list them clearly.

Website Information:
- Business Name: ${website.name}
- Business Type: ${website.businessType}
${context.contactInfo ? `- Email: ${context.contactInfo.email || 'N/A'}
- Phone: ${context.contactInfo.phone || 'N/A'}
- Working Hours: ${context.contactInfo.workingHours || 'N/A'}` : ''}
`;

    return instructions.trim();
  }

  /**
   * Build context from retrieved chunks and additional data
   */
  buildContext(chunks, additionalContext) {
    let context = '';

    // Add retrieved chunks
    if (chunks && chunks.length > 0) {
      context += 'RELEVANT INFORMATION FROM WEBSITE:\n\n';
      chunks.forEach((chunk, index) => {
        context += `[${index + 1}] Source: ${chunk.document.title} (${chunk.document.sourceType})\n`;
        context += `${chunk.chunkText}\n\n`;
      });
    }

    // Add FAQs if available
    if (additionalContext.faqs && additionalContext.faqs.length > 0) {
      context += '\nFREQUENTLY ASKED QUESTIONS:\n\n';
      additionalContext.faqs.forEach((faq, index) => {
        context += `Q${index + 1}: ${faq.question}\n`;
        context += `A${index + 1}: ${faq.answer}\n\n`;
      });
    }

    // Add services if available
    if (additionalContext.services && additionalContext.services.length > 0) {
      context += '\nSERVICES OFFERED:\n\n';
      additionalContext.services.forEach((service, index) => {
        context += `${index + 1}. ${service.name}`;
        if (service.price) {
          context += ` - ${service.currency} ${service.price}`;
        }
        context += `\n   ${service.fullDescription}\n\n`;
      });
    }

    // Add contact info if available
    if (additionalContext.contactInfo) {
      const contact = additionalContext.contactInfo;
      context += '\nCONTACT INFORMATION:\n\n';
      if (contact.email) context += `Email: ${contact.email}\n`;
      if (contact.phone) context += `Phone: ${contact.phone}\n`;
      if (contact.whatsapp) context += `WhatsApp: ${contact.whatsapp}\n`;
      if (contact.address) context += `Address: ${contact.address}\n`;
      if (contact.workingHours) context += `Working Hours: ${contact.workingHours}\n`;
      context += '\n';
    }

    return context;
  }

  /**
   * Extract sources from chunks and context
   */
  extractSources(chunks, additionalContext) {
    const sources = new Set();

    if (chunks && chunks.length > 0) {
      chunks.forEach(chunk => {
        sources.add(chunk.document.sourceType);
      });
    }

    if (additionalContext.faqs && additionalContext.faqs.length > 0) {
      sources.add('faq_items');
    }

    if (additionalContext.services && additionalContext.services.length > 0) {
      sources.add('services');
    }

    if (additionalContext.contactInfo) {
      sources.add('contact_info');
    }

    return Array.from(sources);
  }

  /**
   * Main chat processing method - RAG pipeline
   */
  async processChat(websiteId, message) {
    try {
      // Step 1: Validate website
      logger.info(`Step 1: Validating website ${websiteId}`);
      const website = await databaseService.getWebsiteById(websiteId);

      // Step 2: Retrieve relevant chunks
      logger.info(`Step 2: Retrieving relevant chunks for: "${message}"`);
      const chunks = await retrievalService.retrieve(websiteId, message);

      if (chunks.length === 0) {
        logger.warn('No relevant chunks found');
      }

      // Step 3: Get additional context (FAQs, services, contact)
      logger.info('Step 3: Fetching additional context');
      const additionalContext = await retrievalService.getAdditionalContext(websiteId, message);

      // Step 4: Build context and prompt
      logger.info('Step 4: Building context and system prompt');
      const systemPrompt = this.buildSystemPrompt(website, additionalContext);
      const contextText = this.buildContext(chunks, additionalContext);

      // If no context at all, return fallback
      if (!contextText || contextText.trim().length === 0) {
        return {
          answer: "I apologize, but I don't have enough information in our database to answer your question. Please contact us directly for assistance.",
          sources: [],
          websiteName: website.name,
          chunksRetrieved: 0
        };
      }

      // Step 5: Generate AI response
      logger.info('Step 5: Generating AI response');
      const fullPrompt = `${systemPrompt}\n\n${contextText}\n\nUser Question: ${message}\n\nAssistant Response:`;

      logger.debug('Full prompt:', fullPrompt.substring(0, 500) + '...');

      const result = await this.chatModel.generateContent(fullPrompt);
      const response = result.response;
      const answer = response.text();

      logger.info('AI response generated successfully');

      // Step 6: Extract sources
      const sources = this.extractSources(chunks, additionalContext);

      return {
        answer,
        sources,
        websiteName: website.name,
        chunksRetrieved: chunks.length
      };

    } catch (error) {
      logger.error('Error in chat processing:', error);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError(
        'Failed to process chat message',
        500,
        'CHAT_PROCESSING_ERROR'
      );
    }
  }
}

export const chatService = new ChatService();
