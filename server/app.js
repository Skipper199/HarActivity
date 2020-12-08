const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const singupRouter = require('./controllers/singup');
const loginRouter = require('./controllers/login');
const logger = require('./utils/logger');
const config = require('./utils/config');
const middleware = require('./utils/middleware');

const app = express();

// Connect to database
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message);
  });

// Remove deprecation warning
mongoose.set('useCreateIndex', true);

app.use(cors()); // Handle requests from different ports
app.use(express.static('build')); // Handle static file (react build)
app.use(bodyParser.json()); // Handle request body

// Handle requests to different routes
app.use('/signup', singupRouter);
app.use('/login', loginRouter);

// Handle errors
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
