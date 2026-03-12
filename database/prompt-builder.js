/**
 * AI Chatbot Prompt Builder
 * 
 * This utility helps construct prompts for querying the employee database
 * with an AI assistant (like GPT-4, Claude, etc.)
 */

const fs = require('fs');
const path = require('path');

/**
 * Load employee database from JSON file
 */
function loadEmployeeDatabase() {
  const dbPath = path.join(__dirname, 'employees-seed-data.json');
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
}

/**
 * Build a complete prompt with system instructions and employee data
 * @param {string} userQuery - The user's question
 * @returns {string} Complete prompt ready to send to AI
 */
function buildPrompt(userQuery) {
  const database = loadEmployeeDatabase();
  
  const systemPrompt = `You are an intelligent AI assistant connected to an employee database.

Your job is to answer user questions strictly based on the information stored in the database.

CORE RULES:
1. Always search the employee dataset before answering
2. Only use information that exists in the database
3. Never invent or fabricate information not present in the dataset
4. If multiple employees match the name, choose the closest match
5. If no employee exists, say: "Bu işçi verilənlər bazasında tapılmadı."
6. If requested information is not available, say: "Bu məlumat verilənlər bazasında mövcud deyil."

RESPONSE LANGUAGE: All responses MUST be in Azerbaijani language.

RESPONSE STRUCTURE FOR EMPLOYEE QUERIES:
🔹 İşçi Haqqında Ümumi Məlumat
🔹 Vəzifə və Şöbə
🔹 İş Təcrübəsi
🔹 Texniki Bacarıqlar
🔹 Layihələr
🔹 Performans Xülasəsi
🔹 Peşəkar Bioqrafiya

For short queries: provide 2-3 paragraph summary
For detailed queries: provide full profile with all sections

---

EMPLOYEE DATABASE:

${JSON.stringify(database, null, 2)}

---

USER QUERY: ${userQuery}

---

Now answer the user's query in Azerbaijani, using only information from the database above.`;

  return systemPrompt;
}

/**
 * Build a simplified prompt (for smaller context windows)
 * @param {string} userQuery - The user's question
 * @returns {string} Compact prompt
 */
function buildCompactPrompt(userQuery) {
  const database = loadEmployeeDatabase();
  
  return `You are an AI assistant that answers questions using the employee database below.

Rules:
- Answer in Azerbaijani language
- Use ONLY information from the database
- Never fabricate information
- If employee not found: "Bu işçi verilənlər bazasında tapılmadı."
- If info missing: "Bu məlumat verilənlər bazasında mövcud deyil."

Database:
${JSON.stringify(database, null, 2)}

User Query: ${userQuery}

Answer:`;
}

/**
 * Save prompt to file for inspection
 */
function savePromptToFile(prompt, filename = 'generated-prompt.txt') {
  fs.writeFileSync(path.join(__dirname, filename), prompt, 'utf-8');
  console.log(`Prompt saved to ${filename}`);
}

// Example usage
if (require.main === module) {
  // Test queries
  const testQueries = [
    "Xəyal haqqında ətraflı məlumat ver",
    "Xəyalın bacarıqları nələrdir?",
    "Mühəndislik şöbəsində kimler çalışır?",
    "Node.js bilən işçilər kimlərdir?"
  ];

  console.log('AI Chatbot Prompt Builder\n');
  
  // Build prompt for first test query
  const query = testQueries[0];
  console.log(`Building prompt for query: "${query}"\n`);
  
  const prompt = buildPrompt(query);
  savePromptToFile(prompt, 'example-prompt.txt');
  
  console.log('\nPrompt structure:');
  console.log('- System instructions: ✓');
  console.log('- Employee database: ✓');
  console.log('- User query: ✓');
  console.log('- Response guidelines: ✓');
  console.log('\nReady to send to AI model!');
  
  // Show compact version size comparison
  const compactPrompt = buildCompactPrompt(query);
  console.log(`\nFull prompt size: ${prompt.length} characters`);
  console.log(`Compact prompt size: ${compactPrompt.length} characters`);
}

module.exports = {
  loadEmployeeDatabase,
  buildPrompt,
  buildCompactPrompt,
  savePromptToFile
};
