const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const singupRouter = require('./controllers/singup');
const loginRouter = require('./controllers/login');
const updateUsernameRouter = require('./controllers/updateUsername');
const updatePasswordRouter = require('./controllers/updatePassword');
const uploadRouter = require('./controllers/upload');
const userStatsRouter = require('./controllers/userStats');
const logger = require('./utils/logger');
const config = require('./utils/config');
const middleware = require('./utils/middleware');

const app = express();

app.enable('trust proxy');

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
mongoose.set('useFindAndModify', false);

app.use(cors()); // Handle requests from different ports
app.use(express.static('build')); // Handle static file (react build)
app.use(bodyParser.json({ limit: '50mb' })); // Handle request body
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Handle requests to different routes
app.use('/signup', singupRouter);
app.use('/login', loginRouter);

app.use('/update/username', updateUsernameRouter);
app.use('/update/password', updatePasswordRouter);

app.use('/upload', uploadRouter);
app.use('/userstats', userStatsRouter);

// Handle errors
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
