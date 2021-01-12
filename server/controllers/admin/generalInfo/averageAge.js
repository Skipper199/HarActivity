/* eslint-disable no-loop-func */
/* eslint-disable array-callback-return */
const jwt = require('jsonwebtoken');
const averageAgeRouter = require('express').Router();
const User = require('../../../models/user');
const HarFile = require('../../../models/harFile');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

averageAgeRouter.get('/', async (request, response, next) => {
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

    const neededHeaders = uploadedFiles
      .map((outer) =>
        outer.harRequests
          .map((inner) => {
            if (
              inner.response.headers &&
              inner.response.headers.contentType &&
              inner.response.headers.contentType.includes('/') &&
              inner.response.headers.lastModified
            ) {
              const obj = {
                contentType: inner.response.headers.contentType.split(';')[0],
                startedDateTime: new Date(inner.startedDateTime),
                lastModified: new Date(inner.response.headers.lastModified),
              };
              return obj;
            }
          })
          .filter((x) => x !== undefined)
      )
      .flat(1);

    // Returns all the Content Types
    const contentTypeArray = neededHeaders.map((item) => item.contentType);

    const distinctContentTypeArray = [...new Set(contentTypeArray)];

    const ageArray = [];
    let hits = 0;
    let ageTotal = 0;
    let ageInHours = 0;
    for (let i = 0; i < distinctContentTypeArray.length; i += 1) {
      neededHeaders.map((item) => {
        const regex = new RegExp(`${distinctContentTypeArray[i]}`);

        if (regex.test(item.contentType)) {
          ageInHours =
            (item.startedDateTime.getTime() - item.lastModified.getTime()) /
            3600000;
          ageTotal += ageInHours;
          hits += 1;
        }
      });
      ageArray.push(ageTotal / hits);
    }

    const data = [];
    for (let j = 0; j < distinctContentTypeArray.length; j += 1) {
      data.push({
        contentType: distinctContentTypeArray[j],
        averageAge: parseInt(ageArray[j]),
      });
    }

    return response.status(200).send({ data });
  } catch (error) {
    next(error);
  }
});

module.exports = averageAgeRouter;
