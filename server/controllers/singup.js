const bcrypt = require('bcrypt');
const singupRouter = require('express').Router();
const User = require('../models/user');

// Handle signup request
singupRouter.post('/', async (request, response) => {
  const { body } = request;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    email: body.email,
    passwordHash,
    isAdmin: false,
  });

  try {
    const savedUser = await user.save();
    response.json(savedUser);
  } catch (exception) {
    if (exception.errors.username) {
      return response.status(401).json({
        error: 'Usename already in use.',
      });
    }

    if (exception.errors.email) {
      return response.status(401).json({
        error: 'Email already in use.',
      });
    }

    if (exception.errors.password) {
      return response.status(401).json({
        error: 'Password should be...',
      });
    }

    return response.status(401).json({
      error: 'Duplicate entry',
    });
  }
});

module.exports = singupRouter;
