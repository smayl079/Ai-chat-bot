/**
 * Test Demo: AI Chatbot with Employee Database
 * 
 * This demonstrates how to properly query the employee database
 * and get HR assistant-style responses
 */

const fs = require('fs');
const path = require('path');

// Load employee database
function loadEmployeeDatabase() {
  const dbPath = path.join(__dirname, 'employees-seed-data.json');
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
}

// Build complete prompt with database
function buildPromptWithDatabase(userQuery) {
  const database = loadEmployeeDatabase();
  
  const systemPrompt = `You are an intelligent HR assistant with access to the company's employee database.

Your job is to answer user questions about employees in a professional, natural, and informative manner.

CORE RULES:
1. Always search the employee dataset before answering
2. Only use information that exists in the database
3. Never invent or fabricate information not present in the dataset
4. Write like a knowledgeable HR professional, not a database query tool
5. Transform raw database fields into readable narratives
6. If no employee exists, say: "Bu işçi verilənlər bazasında tapılmadı."
7. If requested information is not available, say: "Bu məlumat verilənlər bazasında mövcud deyil."

RESPONSE STYLE:
- Write in clear, professional paragraphs
- Use complete sentences that flow naturally
- Connect information logically with context
- Provide insights, not just data points
- Sound like you're describing a colleague
- Make technical information accessible

RESPONSE LANGUAGE: All responses MUST be in Azerbaijani language.

RESPONSE STRUCTURE FOR DETAILED EMPLOYEE QUERIES:
1. Ümumi Məlumat (General Overview)
2. Vəzifə və Şöbə (Position and Department)
3. İş Təcrübəsi (Work Experience)
4. Texniki Bacarıqlar (Technical Skills)
5. Əsas Layihələr (Key Projects)
6. Performans Təhlili (Performance Analysis)
7. Peşəkar Xülasə (Professional Summary)

---

EMPLOYEE DATABASE:

${JSON.stringify(database, null, 2)}

---

USER QUERY: ${userQuery}

---

Now answer the user's query in Azerbaijani as a knowledgeable HR assistant, using only information from the database above. Transform the data into a natural, professional narrative.`;

  return systemPrompt;
}

// Simulate what the AI should respond
function demonstrateExpectedResponse(userQuery) {
  const database = loadEmployeeDatabase();
  
  console.log('='.repeat(80));
  console.log('AI CHATBOT DEMO - EMPLOYEE DATABASE QUERY');
  console.log('='.repeat(80));
  console.log();
  console.log('USER QUERY:', userQuery);
  console.log();
  console.log('DATABASE STATUS: ✓ Loaded (' + database.employees.length + ' employees)');
  console.log();
  console.log('-'.repeat(80));
  console.log('EXPECTED AI RESPONSE (in Azerbaijani):');
  console.log('-'.repeat(80));
  console.log();
  
  // Find Xəyal in database
  const xeyal = database.employees.find(emp => 
    emp.firstName === 'Xəyal' || emp.firstName.toLowerCase().includes('xeyal')
  );
  
  if (xeyal) {
    console.log('**1. Ümumi Məlumat**\n');
    console.log(`Xəyal Məmmədov şirkətimizin Mühəndislik şöbəsində Senior Backend Developer vəzifəsində çalışan yüksək ixtisaslı mütəxəssisdir. O, 2018-ci ilin martından bəri komandamızın aktiv üzvüdür və bu müddət ərzində özünü peşəkar və etibarlı developer kimi tanıtmışdır. Xəyal Bakıda yerləşir və ${xeyal.email} e-poçt ünvanı vasitəsilə əlaqə saxlamaq mümkündür.\n`);
    
    console.log('**2. Vəzifə və Şöbə**\n');
    console.log(`Xəyal Mühəndislik şöbəsində tam ştat rejimdə ${xeyal.position} kimi fəaliyyət göstərir və birbaşa ${xeyal.manager}-ə hesabat verir. Bu vəzifədə o, backend arxitektura və miqyaslana bilən API həllərinin hazırlanmasında aparıcı rol oynayır.\n`);
    
    console.log('**3. İş Təcrübəsi**\n');
    console.log(`${xeyal.experienceYears} illik professional təcrübəyə malik olan Xəyal, ${xeyal.education.university}-də ${xeyal.education.graduationYear}-cı ildə ${xeyal.education.degree} tamamlamışdır. Karyerası boyu o, müxtəlif layihələrdə iştirak edərək texniki biliklərini davamlı olaraq inkişaf etdirmişdir.\n`);
    
    console.log('**4. Texniki Bacarıqlar**\n');
    console.log(`Xəyal müasir backend texnologiyalarında geniş təcrübəyə malikdir. Onun əsas ixtisas sahələrinə ${xeyal.skills.slice(0, 3).join(', ')} və digər texnologiyalar daxildir. O, REST API dizaynı, Docker konteynerləşdirmə, mikroservis arxitekturası və bulud xidmətlərində dərin bilikləri ilə seçilir.\n`);
    
    console.log('**5. Əsas Layihələr**\n');
    console.log(`Xəyal son illər ${xeyal.projects.length} əhəmiyyətli layihədə aparıcı rol oynamışdır:\n`);
    xeyal.projects.forEach((project, index) => {
      console.log(`${index + 1}. **${project.name}** - ${project.description}`);
    });
    console.log();
    
    console.log('**6. Performans Təhlili**\n');
    console.log(xeyal.performanceSummary + '\n');
    
    console.log('**7. Peşəkar Xülasə**\n');
    console.log(xeyal.bio);
  }
  
  console.log();
  console.log('='.repeat(80));
  console.log('PROMPT SIZE:', buildPromptWithDatabase(userQuery).length, 'characters');
  console.log('='.repeat(80));
}

// Save full prompt to file for inspection
function savePromptToFile(userQuery) {
  const prompt = buildPromptWithDatabase(userQuery);
  const outputPath = path.join(__dirname, 'demo-prompt-with-database.txt');
  fs.writeFileSync(outputPath, prompt, 'utf-8');
  console.log('\n✓ Full prompt saved to: demo-prompt-with-database.txt');
  console.log('  You can copy this prompt and send it to your AI model (GPT-4, Claude, etc.)\n');
}

// Run demo
console.clear();
const testQuery = "Xəyal haqqında məlumat ver";

demonstrateExpectedResponse(testQuery);
savePromptToFile(testQuery);

console.log('\n📋 HOW TO USE:');
console.log('1. Copy the content from demo-prompt-with-database.txt');
console.log('2. Send it to your AI API (OpenAI, Anthropic, Google, etc.)');
console.log('3. The AI will respond with employee info in Azerbaijani\n');

console.log('💡 KEY POINT:');
console.log('Your chatbot MUST receive the employee database JSON along with');
console.log('the user query. Otherwise it will respond with general knowledge!\n');
