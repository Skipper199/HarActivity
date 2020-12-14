const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Create schema for user
const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Username cannot be empty.'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email cannot be empty.'],
  },
  passwordHash: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
  },
});

// Delete unwanted information
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
    delete returnedObject.isAdmin;
  },
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

module.exports = User;
