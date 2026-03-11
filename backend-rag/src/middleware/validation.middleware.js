// Request Validation Middleware
import { AppError } from '../utils/errors.js';

/**
 * Validate chat request body
 */
export function validateChatRequest(req, res, next) {
  const { websiteId, message } = req.body;

  // Validate websiteId
  if (!websiteId) {
    throw new AppError('websiteId is required', 400, 'VALIDATION_ERROR');
  }

  if (!Number.isInteger(websiteId) || websiteId <= 0) {
    throw new AppError('websiteId must be a positive integer', 400, 'VALIDATION_ERROR');
  }

  // Validate message
  if (!message) {
    throw new AppError('message is required', 400, 'VALIDATION_ERROR');
  }

  if (typeof message !== 'string') {
    throw new AppError('message must be a string', 400, 'VALIDATION_ERROR');
  }

  if (message.trim().length === 0) {
    throw new AppError('message cannot be empty', 400, 'VALIDATION_ERROR');
  }

  if (message.length > 1000) {
    throw new AppError('message is too long (max 1000 characters)', 400, 'VALIDATION_ERROR');
  }

  next();
}
