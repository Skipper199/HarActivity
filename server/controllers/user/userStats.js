/* eslint-disable no-return-assign */
const jwt = require('jsonwebtoken');
const userStatsRouter = require('express').Router();
const HarFile = require('../../models/harFile');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

// Handle user stats request
userStatsRouter.get('/', async (request, response) => {
  const token = getTokenFrom(request);

  const decodedToken = jwt.verify(token, process.env.SECRET);

  // Return error if token is missing or invalid
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'Token missing or invalid' });
  }

  try {
    // Find all the upload based on user id
    const uploadedFiles = await HarFile.find({ user: decodedToken.id });
    let id = 0;

    // Return the response
    const returnedRows = uploadedFiles.map((item) => ({
      id: (id += 1),
      date: item.upload.date.toUTCString(),
      requests: item.harRequests.length,
    }));
    return response.status(200).send(returnedRows);
  } catch (error) {
    return response.status(404).json({
      error: 'An error occured when trying to get files.',
    });
  }
});

module.exports = userStatsRouter;
