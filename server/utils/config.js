require('dotenv').config();

// Set PORT and MONGODB_URI
const { PORT } = process.env;
const { MONGODB_URI } = process.env;

module.exports = {
  MONGODB_URI,
  PORT,
};
