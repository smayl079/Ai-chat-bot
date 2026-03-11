// Global Error Handler Middleware
import { logger } from '../utils/logger.js';
import { AppError } from '../utils/errors.js';

export function errorHandler(err, req, res, next) {
  // Log error
  logger.error('Error caught by global handler:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body
  });

  // Handle AppError (our custom errors)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.code
    });
  }

  // Handle Prisma errors
  if (err.code && err.code.startsWith('P')) {
    return res.status(500).json({
      success: false,
      error: 'Database error',
      code: 'DATABASE_ERROR'
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: err.message,
      code: 'VALIDATION_ERROR'
    });
  }

  // Generic server error
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}
