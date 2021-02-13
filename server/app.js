const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const signupRouter = require('./controllers/signup');
const loginRouter = require('./controllers/login');
const updateUsernameRouter = require('./controllers/user/updateUsername');
const updatePasswordRouter = require('./controllers/user/updatePassword');
const uploadRouter = require('./controllers/user/upload');
const userStatsRouter = require('./controllers/user/userStats');
const heatmapRouter = require('./controllers/user/heatmap');

const countInfoRouter = require('./controllers/admin/generalInfo/countInfo');
const numberOfMethodsRouter = require('./controllers/admin/generalInfo/numberOfMethods');
const numberOfStatusRouter = require('./controllers/admin/generalInfo/numberOfStatus');
const averageAgeRouter = require('./controllers/admin/generalInfo/averageAge');
const responseTimeRouter = require('./controllers/admin/responseTime/responseTime');
const ttlRouter = require('./controllers/admin/cacheInfo/ttl');
const requestDirectivesRouter = require('./controllers/admin/cacheInfo/requestDirectives');
const responseDirectivesRouter = require('./controllers/admin/cacheInfo/responseDirectives');
const flowmapRouter = require('./controllers/admin/flowmap/flowmap');

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
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Error connection to MongoDB:', error.message);
  });

// Remove deprecation warning
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.use(cors()); // Handle requests from different ports
app.use(express.static('build')); // Handle static file (react build)
app.use(bodyParser.json({ limit: '50mb' })); // Handle request body
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Handle requests to different routes
app.use('/api/signup', signupRouter);
app.use('/api/login', loginRouter);

// Handle requests from user
app.use('/api/user/update/username', updateUsernameRouter);
app.use('/api/user/update/password', updatePasswordRouter);
app.use('/api/user/upload', uploadRouter);
app.use('/api/user/userstats', userStatsRouter);
app.use('/api/user/heatmap', heatmapRouter);

// Handle requests from admin
app.use('/api/admin/generalinfo/countinfo', countInfoRouter);
app.use('/api/admin/generalinfo/numberofmethods', numberOfMethodsRouter);
app.use('/api/admin/generalinfo/numberofstatus', numberOfStatusRouter);
app.use('/api/admin/generalinfo/averageage', averageAgeRouter);
app.use('/api/admin/responsetime', responseTimeRouter);
app.use('/api/admin/cacheinfo/ttl', ttlRouter);
app.use('/api/admin/cacheinfo/requestdirectives', requestDirectivesRouter);
app.use('/api/admin/cacheinfo/responsedirectives', responseDirectivesRouter);
app.use('/api/admin/flowmap', flowmapRouter);

// Handle errors
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
