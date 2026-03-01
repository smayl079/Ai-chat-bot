import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

async function testAPI() {
  console.log('Testing Google Gemini API...\n');
  
  if (!process.env.GOOGLE_API_KEY) {
    console.error('❌ GOOGLE_API_KEY not found in .env file');
    return;
  }
  
  console.log('✓ API Key found in .env file');
  console.log(`Key starts with: ${process.env.GOOGLE_API_KEY.substring(0, 10)}...\n`);
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    console.log('Sending test message to Gemini API...');
    const result = await model.generateContent('Hello, respond with "Hi" only');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ API is working!');
    console.log('Response:', text);
    
  } catch (error) {
    console.error('\n❌ API Error:', error.message);
    
    if (error.message?.includes('API_KEY_INVALID') || error.status === 400) {
      console.error('\n💡 Solution: Your API key is invalid.');
      console.error('   Get a new key at: https://makersuite.google.com/app/apikey');
    } else if (error.status === 429) {
      console.error('\n💡 Solution: Rate limit exceeded. Wait a few minutes.');
    } else {
      console.error('\nFull error:', error);
    }
  }
}

testAPI();
