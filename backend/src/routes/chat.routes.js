import { Router } from 'express';
import { validateChatRequest } from '../middleware/validateChatRequest.js';
import { chatController } from '../controllers/chat.controller.js';

const router = Router();

router.post('/chat', validateChatRequest, chatController);

export default router;
