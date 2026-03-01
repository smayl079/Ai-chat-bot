import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

async function listModels() {
  if (!process.env.GOOGLE_API_KEY) {
    console.error('❌ GOOGLE_API_KEY not found');
    return;
  }
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    
    console.log('Fetching available models...\n');
    const models = await genAI.listModels();
    
    console.log('Available models:');
    for await (const model of models) {
      console.log('\n- Model:', model.name);
      console.log('  Display name:', model.displayName);
      console.log('  Supported methods:', model.supportedGenerationMethods?.join(', ') || 'N/A');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.status === 400 || error.message?.includes('API_KEY_INVALID')) {
      console.error('\n💡 Your API key appears to be invalid.');
      console.error('   Get a new key at: https://aistudio.google.com/app/apikey');
    }
  }
}

listModels();
