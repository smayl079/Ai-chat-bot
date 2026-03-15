import { resolveEmployeeFromQuestion, FALLBACK_MESSAGE } from '../services/employee.service.js';
import { generateDatabaseBoundAnswer } from '../services/chat.service.js';

function buildSuccessPayload(answer, extractedName, matchedEmployee) {
  return {
    success: true,
    answer,
    response: answer,
    metadata: {
      source: 'database',
      extractedName,
      matchedEmployee,
    },
  };
}

export async function chatController(req, res, next) {
  try {
    const { message } = req.body;

    const { extractedName, employee } = await resolveEmployeeFromQuestion(message);

    if (!employee) {
      return res.json(buildSuccessPayload(FALLBACK_MESSAGE, extractedName, null));
    }

    const answer = await generateDatabaseBoundAnswer(message, employee);

    return res.json(buildSuccessPayload(answer, extractedName, employee.name));
  } catch (error) {
    return next(error);
  }
}
