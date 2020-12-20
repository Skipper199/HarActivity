const jwt = require('jsonwebtoken');
const numberOfISPsRouter = require('express').Router();
const User = require('../../../models/user');
const HarFile = require('../../../models/harFile');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

numberOfISPsRouter.get('/', async (request, response, next) => {
  const token = getTokenFrom(request);

  const decodedToken = jwt.verify(token, process.env.SECRET);

  // Return error if token is missing or invalid
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'Token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);

  if (!user.isAdmin) {
    return response.status(401).json({ error: 'Unauthorized access.' });
  }

  try {
    // Find all the uploaded files
    const uploadedFiles = await HarFile.find();

    const ISPsArray = uploadedFiles.map((item) => item.upload.isp);

    // Returns a set from an array (Keeps only distinct values)
    const distinctISPsSet = [...new Set(ISPsArray)];

    const count = distinctISPsSet.length;

    return response.status(200).send({ count });
  } catch (error) {
    next(error);
  }
});

module.exports = numberOfISPsRouter;
