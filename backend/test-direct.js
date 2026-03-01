import dotenv from 'dotenv';

dotenv.config();

async function testDirectAPI() {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    console.error('❌ No API key found');
    return;
  }
  
  console.log('Testing API key with direct HTTP request...\n');
  console.log('API Key:', apiKey.substring(0, 10) + '...\n');
  
  // Try different model names
  const modelsToTry = [
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-pro',
    'gemini-1.0-pro'
  ];
  
  for (const modelName of modelsToTry) {
    console.log(`\nTrying model: ${modelName}...`);
    
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Hello'
            }]
          }]
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ SUCCESS! This model works:', modelName);
        console.log('Response:', data.candidates[0].content.parts[0].text);
        break;
      } else {
        const errorData = await response.json();
        console.log(`❌ Status ${response.status}:`, errorData.error?.message || 'Unknown error');
      }
      
    } catch (error) {
      console.log('❌ Network error:', error.message);
    }
  }
}

testDirectAPI();
