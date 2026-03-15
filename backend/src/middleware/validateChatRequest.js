export function validateChatRequest(req, res, next) {
  const { message } = req.body || {};

  if (typeof message !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'message must be a string',
    });
  }

  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return res.status(400).json({
      success: false,
      error: 'message cannot be empty',
    });
  }

  if (trimmedMessage.length > 500) {
    return res.status(400).json({
      success: false,
      error: 'message is too long (max 500 characters)',
    });
  }

  req.body.message = trimmedMessage;
  return next();
}
