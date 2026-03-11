// Database Service - Handles all database queries
import prisma from '../config/database.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../utils/errors.js';

class DatabaseService {
  /**
   * Get website by ID with validation
   */
  async getWebsiteById(websiteId) {
    try {
      const website = await prisma.website.findUnique({
        where: { 
          id: websiteId,
          isActive: true 
        },
        include: {
          contactInfo: true
        }
      });

      if (!website) {
        throw new AppError(`Website with ID ${websiteId} not found or inactive`, 404, 'WEBSITE_NOT_FOUND');
      }

      return website;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching website:', error);
      throw new AppError('Database error fetching website', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Get all active websites
   */
  async getAllWebsites() {
    try {
      return await prisma.website.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          domain: true,
          businessType: true,
          chatbotName: true,
          language: true
        },
        orderBy: { id: 'asc' }
      });
    } catch (error) {
      logger.error('Error fetching websites:', error);
      throw new AppError('Database error fetching websites', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Get all chatbot chunks for a website
   */
  async getChunksForWebsite(websiteId) {
    try {
      const chunks = await prisma.chatbotChunk.findMany({
        where: { websiteId },
        include: {
          document: {
            select: {
              title: true,
              sourceType: true
            }
          }
        },
        orderBy: [
          { documentId: 'asc' },
          { chunkIndex: 'asc' }
        ]
      });

      return chunks;
    } catch (error) {
      logger.error('Error fetching chunks:', error);
      throw new AppError('Database error fetching chunks', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * Keyword-based search in chunks (fallback when no embeddings)
   */
  async searchChunksByKeyword(websiteId, keywords, limit = 5) {
    try {
      // Build search query with multiple keywords
      const searchTerms = keywords
        .toLowerCase()
        .split(' ')
        .filter(term => term.length > 2); // Filter out short words

      if (searchTerms.length === 0) {
        // If no valid keywords, return top chunks
        return await prisma.chatbotChunk.findMany({
          where: { websiteId },
          include: {
            document: {
              select: {
                title: true,
                sourceType: true
              }
            }
          },
          take: limit,
          orderBy: { id: 'asc' }
        });
      }

      // Search for chunks containing any of the keywords
      const chunks = await prisma.$queryRaw`
        SELECT 
          c.id,
          c.website_id as "websiteId",
          c.document_id as "documentId",
          c.chunk_text as "chunkText",
          c.chunk_index as "chunkIndex",
          d.title as "documentTitle",
          d.source_type as "sourceType",
          (
            SELECT COUNT(*) 
            FROM unnest(string_to_array(${searchTerms.join(' ')}, ' ')) AS term
            WHERE LOWER(c.chunk_text) LIKE '%' || term || '%'
          ) as relevance_score
        FROM chatbot_chunks c
        JOIN chatbot_documents d ON c.document_id = d.id
        WHERE c.website_id = ${websiteId}
          AND (
            ${searchTerms.map(term => `LOWER(c.chunk_text) LIKE ${'%' + term + '%'}`).join(' OR ')}
          )
        ORDER BY relevance_score DESC
        LIMIT ${limit}
      `;

      return chunks.map(chunk => ({
        ...chunk,
        document: {
          title: chunk.documentTitle,
          sourceType: chunk.sourceType
        }
      }));
    } catch (error) {
      logger.error('Error searching chunks:', error);
      // Fallback to simple query if complex search fails
      return await prisma.chatbotChunk.findMany({
        where: { websiteId },
        include: {
          document: {
            select: {
              title: true,
              sourceType: true
            }
          }
        },
        take: limit,
        orderBy: { id: 'asc' }
      });
    }
  }

  /**
   * Search FAQs for direct answers
   */
  async searchFAQs(websiteId, question) {
    try {
      // Extract keywords from question
      const keywords = question.toLowerCase();

      const faqs = await prisma.faqItem.findMany({
        where: {
          websiteId,
          OR: [
            { question: { contains: keywords, mode: 'insensitive' } },
            { answer: { contains: keywords, mode: 'insensitive' } }
          ]
        },
        take: 3
      });

      return faqs;
    } catch (error) {
      logger.error('Error searching FAQs:', error);
      return [];
    }
  }

  /**
   * Get all services for a website
   */
  async getServices(websiteId) {
    try {
      return await prisma.service.findMany({
        where: {
          websiteId,
          isActive: true
        },
        select: {
          name: true,
          shortDescription: true,
          fullDescription: true,
          price: true,
          currency: true
        }
      });
    } catch (error) {
      logger.error('Error fetching services:', error);
      return [];
    }
  }

  /**
   * Get contact info for a website
   */
  async getContactInfo(websiteId) {
    try {
      return await prisma.contactInfo.findUnique({
        where: { websiteId }
      });
    } catch (error) {
      logger.error('Error fetching contact info:', error);
      return null;
    }
  }
}

export const databaseService = new DatabaseService();
