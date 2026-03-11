// Gemini AI Configuration
import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger.js';

// Validate API key
if (!process.env.GEMINI_API_KEY) {
  logger.error('❌ GEMINI_API_KEY is not set in environment variables');
  process.exit(1);
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get chat model
export function getChatModel() {
  const modelName = process.env.GEMINI_CHAT_MODEL || 'gemini-1.5-flash';
  return genAI.getGenerativeModel({ model: modelName });
}

// Get embedding model
export function getEmbeddingModel() {
  const modelName = process.env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004';
  return genAI.getGenerativeModel({ model: modelName });
}

// Configuration
export const geminiConfig = {
  chatModel: process.env.GEMINI_CHAT_MODEL || 'gemini-1.5-flash',
  embeddingModel: process.env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004',
  maxChunksToRetrieve: parseInt(process.env.MAX_CHUNKS_TO_RETRIEVE) || 5,
  embeddingDimension: parseInt(process.env.EMBEDDING_DIMENSION) || 768,
};

logger.info('✅ Gemini AI configured');
logger.info(`   Chat Model: ${geminiConfig.chatModel}`);
logger.info(`   Embedding Model: ${geminiConfig.embeddingModel}`);

export default genAI;
