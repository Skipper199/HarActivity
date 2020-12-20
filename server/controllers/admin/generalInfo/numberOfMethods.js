const jwt = require('jsonwebtoken');
const numberOfMethodsRouter = require('express').Router();
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
numberOfMethodsRouter.get('/', async (request, response, next) => {
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
    // Find all the upload
    const uploadedFiles = await HarFile.find({}).select('harRequests');

    // Returns only the method arrays
    const methodArray = uploadedFiles.map((outer) =>
      outer.harRequests.map((inner) => 
         (inner.request.method)
      )
    );

    // Merges all the methods arrays into one
    const mergedMethodArray = methodArray.flat(1);

    // Returns a set from an array (Keeps only distinct values)
    const distinctMethodSet = [...new Set(mergedMethodArray)];

    // Returns an array from previous set
    const distinctMethodArray = Array.from(distinctMethodSet);

    // Function to count occurrences of values in an array
    const countOccurrences = (arr, val) =>
      arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

    // Array to hold the occurrences of each serverLoc
    const counts = [];
    for (let i = 0; i < distinctMethodArray.length; i += 1) {
      // Find occurances of respected value and pushes it to counts
      counts.push(countOccurrences(mergedMethodArray, distinctMethodArray[i]));
    }

    // Array to hold the number of occurances per request
    const data = [];
    for (let j = 0; j < counts.length; j += 1) {
      data.push({
        method: distinctMethodArray[j],
        count: counts[j],
      });
    }

    return response.status(200).send( data );
  } catch (error) {
    next(error);
  }
});

module.exports = numberOfMethodsRouter;
