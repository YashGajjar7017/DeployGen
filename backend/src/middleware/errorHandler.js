/**
 * Error Handler Middleware
 * Centralized error handling for API responses
 */

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // MongoDB ID error
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    err = new ErrorHandler(message, 400);
  }

  // JWT expired error
  if (err.name === 'JsonWebTokenError') {
    const message = 'JSON Web Token is invalid. Try again!';
    err = new ErrorHandler(message, 400);
  }

  // JWT expire error
  if (err.name === 'TokenExpiredError') {
    const message = 'JSON Web Token is expired. Try again!';
    err = new ErrorHandler(message, 400);
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default ErrorHandler;
