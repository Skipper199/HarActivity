const jwt = require('jsonwebtoken');
const countInfoRouter = require('express').Router();
const User = require('../../../models/user');
const HarFile = require('../../../models/harFile');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

// Handle update username request
countInfoRouter.get('/', async (request, response, next) => {
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
    // User count
    const usersCount = await User.count({ isAdmin: false });

    // Find all the uploaded files
    const uploadedFiles = await HarFile.find();

    // Domain Count
    const domainArray = uploadedFiles.map((outer) =>
      outer.harRequests.map((inner) => inner.request.url)
    );
    const mergedLocArray = domainArray.flat(1);
    const distinctDomainSet = [...new Set(mergedLocArray)];
    const domainsCount = distinctDomainSet.length;

    // ISPs count
    const ISPsArray = uploadedFiles.map((item) => item.upload.isp);
    const distinctISPsSet = [...new Set(ISPsArray)];
    const ispsCount = distinctISPsSet.length;

    return response.status(200).send({ usersCount, domainsCount, ispsCount });
  } catch (error) {
    next(error);
  }
});

module.exports = countInfoRouter;
