// Database Configuration - Prisma Client
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

// Create Prisma Client instance
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

// Test database connection
async function testConnection() {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
async function disconnect() {
  await prisma.$disconnect();
  logger.info('Database disconnected');
}

// Initialize connection on startup
testConnection();

// Handle shutdown
process.on('beforeExit', disconnect);

export default prisma;
