import { getChatModel } from '../config/gemini.js';
import { env } from '../config/env.js';

const model = getChatModel();

function buildEmployeeContext(employee) {
  const skills = employee.skills.length > 0 ? employee.skills.join(', ') : 'N/A';

  return [
    `Name: ${employee.name}`,
    `Position: ${employee.position}`,
    `Experience: ${employee.experience}`,
    `Skills: ${skills}`,
    `Location: ${employee.location}`,
  ].join('\n');
}

function buildPrompt(question, employee) {
  const employeeContext = buildEmployeeContext(employee);

  return `User question: ${question}

Employee data:
${employeeContext}

Instructions:
- Answer the question using only the employee data above.
- Do not invent or assume any missing information.
- If the requested information is missing from the employee data, return exactly: "${env.fallbackMessage}"
- Keep the answer concise and factual.`;
}

export async function generateDatabaseBoundAnswer(question, employee) {
  const prompt = buildPrompt(question, employee);

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.1,
      topP: 0.8,
      maxOutputTokens: 300,
    },
  });

  const answer = result.response?.text()?.trim();

  if (!answer) {
    return env.fallbackMessage;
  }

  return answer;
}
