import dotenv from 'dotenv';

dotenv.config();

async function validateAPIKey() {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    console.error('❌ No API key found');
    return;
  }
  
  console.log('Validating API key...\n');
  
  try {
    // Try to list models
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    console.log('Fetching available models from Google...');
    const response = await fetch(listUrl);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log(`\n❌ API Key Error (Status ${response.status}):`);
      console.log(errorData);
      
      if (response.status === 400) {
        console.log('\n💡 Your API key appears to be INVALID or MALFORMED.');
        console.log('   Please get a new API key from: https://aistudio.google.com/app/apikey');
        console.log('\n   Steps to get a new key:');
        console.log('   1. Visit https://aistudio.google.com/app/apikey');
        console.log('   2. Click "Create API Key"');
        console.log('   3. Copy the key and update your .env file');
      }
      return;
    }
    
    const data = await response.json();
    
    console.log('\n✅ API Key is VALID!\n');
    console.log('Available models:\n');
    
    if (data.models && data.models.length > 0) {
      data.models.forEach(model => {
        const modelName = model.name.replace('models/', '');
        const methods = model.supportedGenerationMethods || [];
        
        if (methods.includes('generateContent')) {
          console.log(`✓ ${modelName}`);
          console.log(`  Display: ${model.displayName || 'N/A'}`);
          console.log(`  Methods: ${methods.join(', ')}`);
          console.log('');
        }
      });
    } else {
      console.log('No models available for this API key.');
    }
    
  } catch (error) {
    console.error('❌ Network Error:', error.message);
  }
}

validateAPIKey();
