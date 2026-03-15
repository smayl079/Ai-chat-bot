export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const safeMessage = statusCode >= 500 ? 'Internal server error' : err.message;

  console.error('Request error:', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
  });

  res.status(statusCode).json({
    success: false,
    error: safeMessage,
    details: process.env.NODE_ENV === 'development' && statusCode >= 500 ? err.message : undefined,
  });
}
