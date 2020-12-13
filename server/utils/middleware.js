const logger = require('./logger');

// Print info about request
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

// Handle unknown routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

// Handle errors
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (
    (error.name === 'MongoError' && error.codeName === 'DuplicateKey') ||
    (error.name === 'ValidationError' && error.errors.username)
  ) {
    return response.status(401).json({
      error: 'Usename already in use.',
    });
  }
  if (error.name === 'ValidationError' && error.errors.email) {
    return response.status(401).json({
      error: 'Email already in use.',
    });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' });
  }

  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
