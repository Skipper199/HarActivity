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

    // Returns all the responses
    const responseArray = uploadedFiles.map((outer) =>
      outer.harRequests.map((middle) => {
        if (middle.response) return middle.response;
      })
    );

    // Merges all the responses into one array
    const mergedResponseArray = responseArray.flat(1);

    // Returns all the headers
    const headersArray = mergedResponseArray.map((item) => {
      if (item.headers) return item.headers;
    });

    // Removes undefined values
    const filteredHeadersArray = headersArray.filter((x) => x !== undefined);

    // Returns all the Content Types
    const contentTypeArray = filteredHeadersArray.map((item) => {
      if (item.contentType) return item.contentType;
    });

    // Removes undefined values
    const filteredContentTypeArray = contentTypeArray.filter(
      (x) => x !== undefined
    );

    // Regex to keep everything before ;
    const regexContentTypeArray = filteredContentTypeArray.map(
      (item) => item.split(';')[0]
    );

    const distinctContentTypeArray = [...new Set(regexContentTypeArray)];
    const distinctContentTypeArrayFinal = distinctContentTypeArray.filter(
      (item) => item !== ''
    );

    const ageArray = [];
    let hits = 0;
    let ageTotal = 0;
    let age = 0;
    for (let i = 0; i < distinctContentTypeArray.length; i += 1) {
      filteredHeadersArray.map((item) => {
        const regex = new RegExp(`${distinctContentTypeArray[i]}`);

        if (regex.test(item.contentType)) {
          if (item.age) {
            age = parseInt(item.age);
            ageTotal += age;
            hits += 1;
          }
        }
      });
      if (ageTotal === 0) ageArray.push(0);
      else ageArray.push(ageTotal / hits);
    }

    const data = [];
    for (let j = 0; j < distinctContentTypeArray.length; j += 1) {
      data.push({
        contentType: distinctContentTypeArray[j],
        averageAge: parseInt(ageArray[j]),
      });
    }
    console.log(distinctContentTypeArrayFinal);

    return response.status(200).send({ data });
  } catch (error) {
    next(error);
  }
});

module.exports = averageAgeRouter;
