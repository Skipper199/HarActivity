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

mongoose
  .connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.static('build'));
app.use(bodyParser.json());

app.use('/signup', singupRouter);
app.use('/login', loginRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
