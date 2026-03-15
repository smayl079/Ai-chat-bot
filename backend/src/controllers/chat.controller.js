import { resolveEmployeeFromQuestion, FALLBACK_MESSAGE } from '../services/employee.service.js';
import { generateDatabaseBoundAnswer } from '../services/chat.service.js';

export async function chatController(req, res, next) {
  try {
    const { message } = req.body;

    const { extractedName, employee } = await resolveEmployeeFromQuestion(message);

    if (!employee) {
      return res.json({
        success: true,
        answer: FALLBACK_MESSAGE,
        metadata: {
          source: 'database',
          extractedName,
          matchedEmployee: null,
        },
      });
    }

    const answer = await generateDatabaseBoundAnswer(message, employee);

    return res.json({
      success: true,
      answer,
      metadata: {
        source: 'database',
        extractedName,
        matchedEmployee: employee.name,
      },
    });
  } catch (error) {
    return next(error);
  }
}
