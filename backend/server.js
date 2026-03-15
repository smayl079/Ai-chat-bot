import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './src/config/env.js';
import chatRoutes from './src/routes/chat.routes.js';
import { validateChatRequest } from './src/middleware/validateChatRequest.js';
import { chatController } from './src/controllers/chat.controller.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { initializeDatabase, closeDatabase } from './src/config/database.js';

const app = express();
const corsConfig =
  env.allowedOrigins === '*'
    ? { origin: '*', credentials: false }
    : { origin: env.allowedOrigins, credentials: true };

app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json({ limit: '16kb' }));

app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'ai-chatbot-backend',
    dbType: env.dbType,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', chatRoutes);

// Backward-compatible endpoints for existing frontend code.
app.post('/chat', validateChatRequest, chatController);
app.post('/chat-session', validateChatRequest, chatController);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

app.use(errorHandler);

let server;
let shuttingDown = false;

async function bootstrap() {
  await initializeDatabase();

  server = app.listen(env.port, () => {
    console.log(`Server is running on http://localhost:${env.port}`);
    console.log(`POST /api/chat`);
  });
}

async function shutdown(signal) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  console.log(`${signal} received. Shutting down...`);

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  await closeDatabase();
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

try {
  await bootstrap();
} catch (error) {
  console.error('Failed to start server:', error.message);
  process.exit(1);
}
