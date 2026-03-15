import { findEmployeeByName } from '../config/database.js';
import { env } from '../config/env.js';

export const FALLBACK_MESSAGE = env.fallbackMessage;

const NAME_PATTERNS = [
  /(?:who is|who's|tell me about|about|information about|info about|profile of|details for)\s+(\p{L}[\p{L}\s.'-]{0,79})/iu,
  /(?:employee|person)\s+named\s+(\p{L}[\p{L}\s.'-]{0,79})/iu,
  /(?:give me|show me|find)\s+(?:info|information|details)\s+(?:about\s+)?(\p{L}[\p{L}\s.'-]{0,79})/iu,
  /^(\p{L}[\p{L}\s.'-]{0,79}?)\s+(?:haqqında|barədə)\b/iu,
  /^(\p{L}[\p{L}\s.'-]{0,79}?)(?:ın|in|un|ün|nın|nin|nun|nün)\s+(?:vəzifəsi|tecrubesi|təcrübəsi|bacarıqları|bacariqlari|məlumatı|melumati|işi|yeri|harada)\b/iu,
];

const EN_TRAILING_WORDS = /\b(please|from|database|db|in|at|for|with|position|experience|skills|location)\b.*$/iu;
const AZ_TRAILING_WORDS = /\b(haqqında|barədə|vəzifəsi|tecrubesi|təcrübəsi|bacarıqları|bacariqlari|məlumatı|melumati|işi|yeri|harada)\b.*$/iu;
const QUOTED_NAME_PATTERN = /["'](\p{L}[\p{L}\s.'-]{0,79})["']/u;

function cleanNameCandidate(rawValue) {
  if (!rawValue) {
    return '';
  }

  const withoutTrailing = rawValue.replace(EN_TRAILING_WORDS, '').replace(AZ_TRAILING_WORDS, '');

  return withoutTrailing
    .replace(/^[^\p{L}]+/u, '')
    .replace(/[^\p{L}\s.'-]+$/u, '')
    .replaceAll(/\s+/g, ' ')
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
    const match = pattern.exec(normalizedQuestion);
    if (match?.[1]) {
      const extracted = cleanNameCandidate(match[1]);
      if (extracted) {
        return extracted;
      }
    }
  }

  const quotedMatch = QUOTED_NAME_PATTERN.exec(normalizedQuestion);
  if (quotedMatch?.[1]) {
    const extracted = cleanNameCandidate(quotedMatch[1]);
    if (extracted) {
      return extracted;
    }
  }

  const words = normalizedQuestion
    .replaceAll(/[^\p{L}\s'-]/gu, ' ')
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
