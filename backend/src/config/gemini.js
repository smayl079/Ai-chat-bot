import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from './env.js';

const genAI = new GoogleGenerativeAI(env.geminiApiKey);

export function getChatModel() {
  return genAI.getGenerativeModel({ model: env.geminiModel });
}
