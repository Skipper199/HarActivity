const jwt = require('jsonwebtoken');
const numberOfDomainsRouter = require('express').Router();
const User = require('../../../models/user');
const HarFile = require('../../../models/harFile');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

numberOfDomainsRouter.get('/', async (request, response, next) => {
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

    const domainArray = uploadedFiles.map((outer) =>
      outer.harRequests.map((inner) => inner.request.url)
    );

    const mergedLocArray = domainArray.flat(1);

    // Returns a set from an array (Keeps only distinct values)
    const distinctDomainSet = [...new Set(mergedLocArray)];

    const count = distinctDomainSet.length;

    return response.status(200).send({ count });
  } catch (error) {
    next(error);
  }
});

module.exports = numberOfDomainsRouter;
