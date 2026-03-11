// Embedding Service - Generates embeddings using Gemini API
import { getEmbeddingModel } from '../config/gemini.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../utils/errors.js';

class EmbeddingService {
  constructor() {
    this.model = getEmbeddingModel();
  }

  /**
   * Generate embedding for a single text
   * @param {string} text - Text to embed
   * @returns {Promise<number[]>} - Embedding vector
   */
  async generateEmbedding(text) {
    try {
      if (!text || text.trim().length === 0) {
        throw new AppError('Text cannot be empty', 400, 'INVALID_INPUT');
      }

      logger.debug(`Generating embedding for text: "${text.substring(0, 50)}..."`);

      const result = await this.model.embedContent(text);
      const embedding = result.embedding.values;

      logger.debug(`Embedding generated: ${embedding.length} dimensions`);

      return embedding;
    } catch (error) {
      logger.error('Error generating embedding:', error.message);
      throw new AppError('Failed to generate embedding', 500, 'EMBEDDING_ERROR');
    }
  }

  /**
   * Generate embeddings for multiple texts (batch)
   * @param {string[]} texts - Array of texts to embed
   * @returns {Promise<number[][]>} - Array of embedding vectors
   */
  async generateEmbeddings(texts) {
    try {
      if (!texts || texts.length === 0) {
        return [];
      }

      logger.debug(`Generating embeddings for ${texts.length} texts`);

      const embeddings = await Promise.all(
        texts.map(text => this.generateEmbedding(text))
      );

      return embeddings;
    } catch (error) {
      logger.error('Error generating batch embeddings:', error.message);
      throw new AppError('Failed to generate embeddings', 500, 'EMBEDDING_ERROR');
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   * @param {number[]} vec1 - First vector
   * @param {number[]} vec2 - Second vector
   * @returns {number} - Similarity score (0 to 1)
   */
  cosineSimilarity(vec1, vec2) {
    if (vec1.length !== vec2.length) {
      throw new Error('Vectors must have same length');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }

    const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    return similarity;
  }
}

export const embeddingService = new EmbeddingService();
