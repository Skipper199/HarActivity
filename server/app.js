/* eslint-disable import/no-extraneous-dependencies */
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const config = require('./utils/config');
require('express-async-errors');

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = app;
