// Custom Error Classes

/**
 * Application Error - Base class for custom errors
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error
 */
export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

/**
 * Not Found Error
 */
export class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

/**
 * Database Error
 */
export class DatabaseError extends AppError {
  constructor(message) {
    super(message, 500, 'DATABASE_ERROR');
    this.name = 'DatabaseError';
  }
}

/**
 * API Error (External API failures)
 */
export class APIError extends AppError {
  constructor(message, apiName = 'External API') {
    super(`${apiName}: ${message}`, 502, 'API_ERROR');
    this.name = 'APIError';
    this.apiName = apiName;
  }
}
