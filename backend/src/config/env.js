import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_FALLBACK = 'The requested information is not available in the database.';
const rawDbType = (process.env.DB_TYPE || (process.env.MONGODB_URI ? 'mongodb' : 'postgres')).toLowerCase();

if (!['postgres', 'mongodb'].includes(rawDbType)) {
  throw new Error("DB_TYPE must be either 'postgres' or 'mongodb'.");
}

const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!geminiApiKey) {
  throw new Error('GEMINI_API_KEY (or GOOGLE_API_KEY) is required.');
}

const allowedOriginsValue = process.env.ALLOWED_ORIGINS || '*';
const allowedOrigins =
  allowedOriginsValue === '*'
    ? '*'
    : allowedOriginsValue
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

if (rawDbType === 'postgres' && !process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required when DB_TYPE=postgres.');
}

if (rawDbType === 'mongodb' && !process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is required when DB_TYPE=mongodb.');
}

export const env = {
  port: Number.parseInt(process.env.PORT || '5000', 10),
  dbType: rawDbType,
  geminiApiKey,
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  fallbackMessage: process.env.DB_NOT_FOUND_MESSAGE || DEFAULT_FALLBACK,
  allowedOrigins,
  postgres: {
    connectionString: process.env.DATABASE_URL,
    employeeTable: process.env.EMPLOYEE_TABLE || 'employees',
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB_NAME || 'chatbot',
    collection: process.env.MONGODB_COLLECTION || 'employees',
  },
};
