const bcrypt = require('bcrypt');
const singupRouter = require('express').Router();
const User = require('../models/user');

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

  const savedUser = await user.save();

  response.json(savedUser);
});

module.exports = singupRouter;
