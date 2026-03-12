/**
 * INTEGRATION EXAMPLE
 * How to properly connect your chatbot to the employee database
 */

const fs = require('fs');
const path = require('path');

// Load employee database
const employeeDB = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'database', 'employees-seed-data.json'), 'utf-8')
);

// System prompt with database
const SYSTEM_PROMPT = `You are an intelligent HR assistant with access to the company's employee database.

CORE RULES:
1. Always search the employee dataset before answering
2. Only use information from the database
3. Write in Azerbaijani language
4. Respond like an HR professional

EMPLOYEE DATABASE:
${JSON.stringify(employeeDB, null, 2)}

Answer user questions using ONLY this database information.`;

// Example: Send to OpenAI
async function askChatbot(userQuery) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer YOUR_API_KEY`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userQuery }
      ]
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content;
}

// Example: Send to Anthropic Claude
async function askClaudeChatbot(userQuery) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'YOUR_API_KEY',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [
        { role: 'user', content: SYSTEM_PROMPT + '\n\nUser Query: ' + userQuery }
      ]
    })
  });
  
  const data = await response.json();
  return data.content[0].text;
}

// Example: Send to Google Gemini
async function askGeminiChatbot(userQuery) {
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: SYSTEM_PROMPT + '\n\nUser Query: ' + userQuery
          }]
        }]
      })
    }
  );
  
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

// Test
console.log('Testing query: "Xəyal haqqında məlumat ver"');
console.log('\n✓ Database loaded with', employeeDB.employees.length, 'employees');
console.log('✓ System prompt includes database');
console.log('\nNow when you send to AI, it will search the database!');

module.exports = { askChatbot, askClaudeChatbot, askGeminiChatbot };
