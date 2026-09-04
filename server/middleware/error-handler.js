export function errorHandler(error, req, res, next) {
  console.error(`Server error: ${error.message}`);

  const isDevelopment = process.env.NODE_ENV !== 'production';

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: isDevelopment ? error.message : 'Invalid request data'
    });
  }

  if (error.message.includes('already exists') || error.message.includes('duplicate')) {
    return res.status(409).json({
      message: error.message
    });
  }

  if (error.message.includes('not found') || error.message.includes('does not exist')) {
    return res.status(404).json({
      message: error.message
    });
  }

  if (error.message.includes('unauthorized') || error.message.includes('authentication')) {
    return res.status(401).json({
      message: 'Authentication failed'
    });
  }

  res.status(500).json({
    message: isDevelopment ? error.message : 'Internal server error'
  });
}
