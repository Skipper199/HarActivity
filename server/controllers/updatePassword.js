const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const updatePasswordRouter = require('express').Router();
const PasswordValidator = require('password-validator');
const User = require('../models/user');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

// Handle update password request
updatePasswordRouter.put('/', async (request, response) => {
  const { body } = request;
  const token = getTokenFrom(request);

  const { oldPassword } = body;
  const decodedToken = jwt.verify(token, process.env.SECRET);

  // Return error if token is missing or invalid
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'Token missing or invalid' });
  }

  // Find user by token
  const user = await User.findById(decodedToken.id);

  // Check if the old password is correct
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(oldPassword, user.passwordHash);

  // Return error if old password is incorrect
  if (!passwordCorrect) {
    return response.status(401).json({
      error: 'Old password is incorrect',
    });
  }

  // Set rules for new password
  const passwordSchema = new PasswordValidator();
  passwordSchema.is().min(8).has().uppercase(1).has().digits(1).has().symbols(1);

  // Returns an array with the password errors
  const validatePassword = passwordSchema.validate(body.newPassword, {
    list: true,
  });

  // Checks for password errors and return the appropiate error
  if (validatePassword.includes('min')) {
    return response.status(401).json({
      error: 'New password should be at least 8 characters long.',
    });
  }
  if (validatePassword.includes('uppercase')) {
    return response.status(401).json({
      error: 'New password should contain at least one uppercase letter.',
    });
  }
  if (validatePassword.includes('digits')) {
    return response.status(401).json({
      error: 'New password should contain at least one digit.',
    });
  }
  if (validatePassword.includes('symbols')) {
    return response.status(401).json({
      error: 'New password should contain at least one symbol.',
    });
  }

  // Hashes the new password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.newPassword, saltRounds);

  const passwordHashObj = { passwordHash };

  // Replace old hash with the new hash password
  await User.findByIdAndUpdate(decodedToken.id, passwordHashObj, { new: true });
  return response.status(200).send({
    message: 'Password updated successfully',
  });
});

module.exports = updatePasswordRouter;
