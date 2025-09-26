// Centralized 404 handler
export function notFoundHandler(req, res, next) {
  res.status(404).json({ message: 'Route not found' });
}

// Centralized error handler for consistent API responses
export function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
}


