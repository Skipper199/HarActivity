const jwt = require('jsonwebtoken');
const updateProfileRouter = require('express').Router();
const User = require('../models/user');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

// Handle update username request
updateProfileRouter.put('/', async (request, response, next) => {
  const { body } = request;
  const token = getTokenFrom(request);

  const newUsername = { username: body.newUsername };
  const decodedToken = jwt.verify(token, process.env.SECRET);

  // Return error if token is missing or invalid
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'Token missing or invalid' });
  }

  try {
    await User.findByIdAndUpdate(decodedToken.id, newUsername, { new: true });
    return response.status(200).send({ newUsername: newUsername.username });
  } catch (error) {
    next(error);
  }
});

module.exports = updateProfileRouter;
