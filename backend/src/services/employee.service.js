import { findEmployeeByName } from '../config/database.js';
import { env } from '../config/env.js';

export const FALLBACK_MESSAGE = env.fallbackMessage;

const NAME_PATTERNS = [
  /(?:who is|who's|tell me about|about|information about|info about|profile of|details for)\s+([\p{L}][\p{L}\s.'-]{0,79})/iu,
  /(?:employee|person)\s+named\s+([\p{L}][\p{L}\s.'-]{0,79})/iu,
  /(?:give me|show me|find)\s+(?:info|information|details)\s+(?:about\s+)?([\p{L}][\p{L}\s.'-]{0,79})/iu,
];

const TRAILING_WORDS = /\b(please|from|database|db|in|at|for|with|position|experience|skills|location)\b.*$/iu;

function cleanNameCandidate(rawValue) {
  if (!rawValue) {
    return '';
  }

  const withoutTrailing = rawValue.replace(TRAILING_WORDS, '');

  return withoutTrailing
    .replace(/^[^\p{L}]+/u, '')
    .replace(/[^\p{L}\s.'-]+$/u, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function uniqueCandidates(values) {
  return [...new Set(values.filter(Boolean).map((value) => value.trim()).filter(Boolean))];
}

export function extractEmployeeName(question) {
  if (!question || typeof question !== 'string') {
    return null;
  }

  const normalizedQuestion = question.trim();

  for (const pattern of NAME_PATTERNS) {
    const match = normalizedQuestion.match(pattern);
    if (match && match[1]) {
      const extracted = cleanNameCandidate(match[1]);
      if (extracted) {
        return extracted;
      }
    }
  }

  const quotedMatch = normalizedQuestion.match(/["']([\p{L}][\p{L}\s.'-]{0,79})["']/u);
  if (quotedMatch && quotedMatch[1]) {
    const extracted = cleanNameCandidate(quotedMatch[1]);
    if (extracted) {
      return extracted;
    }
  }

  const words = normalizedQuestion
    .replace(/[^\p{L}\s'-]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);

  if (words.length >= 1 && words.length <= 3) {
    return cleanNameCandidate(words.join(' '));
  }

  return null;
}

async function findByCandidateList(candidates) {
  for (const candidate of candidates) {
    const employee = await findEmployeeByName(candidate);
    if (employee) {
      return employee;
    }
  }

  return null;
}

export async function resolveEmployeeFromQuestion(question) {
  const extractedName = extractEmployeeName(question);

  if (!extractedName) {
    return {
      extractedName: null,
      employee: null,
    };
  }

  const nameParts = extractedName.split(/\s+/).filter(Boolean);
  const candidates = uniqueCandidates([
    extractedName,
    nameParts.slice(0, 2).join(' '),
    nameParts[0],
  ]);

  const employee = await findByCandidateList(candidates);

  return {
    extractedName,
    employee,
  };
}
