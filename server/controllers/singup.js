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
  } catch (e) {
    console.log(e);
    return response.status(401).json({
      error: 'Duplicate entry',
    });
  }
});

module.exports = singupRouter;
