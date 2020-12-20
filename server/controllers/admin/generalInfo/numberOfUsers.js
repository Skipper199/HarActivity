const jwt = require('jsonwebtoken');
const numberOfUsersRouter = require('express').Router();
const User = require('../../../models/user');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

// Handle update username request
numberOfUsersRouter.get('/', async (request, response, next) => {
  const token = getTokenFrom(request);

  const decodedToken = jwt.verify(token, process.env.SECRET);

  // Return error if token is missing or invalid
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'Token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);

  if (!user.isAdmin) {
    return response.status(401).json({ error: 'Unauthorized access.' });
  }

  try {
    const count = await User.count({ isAdmin: false });
    return response.status(200).send({ count });
  } catch (error) {
    next(error);
  }
});

module.exports = numberOfUsersRouter;
