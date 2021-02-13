const logger = require('./logger');

// Handle unknown routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

// Handle errors
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  // Sign Up Username errors
  if (error.name === 'ValidationError' && error.errors.username) {
    if (error.errors.username.kind === 'unique') {
      return response.status(401).json({
        error: 'Username already in use.',
      });
    }
    if (error.errors.username.kind === 'required') {
      return response.status(401).json({
        error: error.errors.username.message,
      });
    }
  }
  // Sign Up Email errors
  if (error.name === 'ValidationError' && error.errors.email) {
    if (error.errors.email.kind === 'unique') {
      return response.status(401).json({
        error: 'Email already in use.',
      });
    }
    if (error.errors.email.kind === 'required') {
      return response.status(401).json({
        error: error.errors.email.message,
      });
    }
  }
  // Update Username errors (from Profile Settings)
  if (error.name === 'MongoError' && error.codeName === 'DuplicateKey') {
    return response.status(401).json({
      error: 'Username already in use.',
    });
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' });
  }

  next(error);
};

module.exports = {
  unknownEndpoint,
  errorHandler,
};
