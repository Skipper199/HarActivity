const bcrypt = require('bcrypt');
const singupRouter = require('express').Router();
const PasswordValidator = require('password-validator');
const User = require('../models/user');

// Handle signup request
singupRouter.post('/', async (request, response) => {
  const { body } = request;

  // Set rules for password
  const passwordSchema = new PasswordValidator();
  passwordSchema.is().min(8).has().uppercase(1).has().digits(1).has().symbols(1);

  // Returns an array with the password errors
  const validatePassword = passwordSchema.validate(body.password, {
    list: true,
  });

  // Hashes the password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  // Creates new user
  const user = new User({
    username: body.username,
    email: body.email,
    passwordHash,
    isAdmin: false,
  });

  // Saves the user and handles possible errors
  try {
    // Checks for password errors
    if (validatePassword.includes('min')) {
      return response.status(401).json({
        error: 'Password should be at least 8 characters long.',
      });
    }
    if (validatePassword.includes('uppercase')) {
      return response.status(401).json({
        error: 'Password should contain at least one uppercase letter.',
      });
    }
    if (validatePassword.includes('digits')) {
      return response.status(401).json({
        error: 'Password should contain at least one digit.',
      });
    }
    if (validatePassword.includes('symbols')) {
      return response.status(401).json({
        error: 'Password should contain at least one symbol.',
      });
    }
    const savedUser = await user.save();
    response.json(savedUser);
  } catch (exception) {
    // Checks for duplicate entries
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
  }
});

module.exports = singupRouter;
