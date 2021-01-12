/* eslint-disable array-callback-return */
/* eslint-disable no-return-assign */
const jwt = require('jsonwebtoken');
const heatmapRouter = require('express').Router();
const HarFile = require('../../models/harFile');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

// Handle user stats request
heatmapRouter.get('/', async (request, response) => {
  const token = getTokenFrom(request);

  const decodedToken = jwt.verify(token, process.env.SECRET);

  // Return error if token is missing or invalid
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'Token missing or invalid' });
  }

  try {
    // Find all the uploaded files based on user id
    const uploadedFiles = await HarFile.find({ user: decodedToken.id });

    // Returns only the serverLoc arrays where content-type is text/html
    const serverLocArray = uploadedFiles.map((outer) =>
      outer.harRequests.map((inner) => {
        if (
          inner.response.headers &&
          inner.response.headers.contentType &&
          inner.response.headers.contentType.includes('text/html')
        )
          return inner.serverLoc;
      })
    );

    // Merges all the serverLoc into one array
    const mergedLocArray = serverLocArray.flat(1);

    // Removes undefined values from the array
    const filteredMergedLocArray = mergedLocArray.filter(
      (x) => x !== undefined
    );

    // Stringifies merged serverLoc array
    const mergedLocStringArray = filteredMergedLocArray.map((item) =>
      JSON.stringify(item)
    );

    // Returns a set from an array (Keeps only distinct values)
    const distinctServerLocSet = [...new Set(mergedLocStringArray)];

    // Returns an array from previous set
    const distinctServerLocArray = Array.from(distinctServerLocSet);

    // Returns actual array from stringified array
    const filteredServerLoc = distinctServerLocArray.map((item) => {
      if (item) {
        const reducedString = item.slice(1, -1);
        const locArrString = reducedString.split(',');
        return locArrString.map((i) => parseFloat(i));
      }
    });

    // Function to count occurrences of values in an array
    const countOccurrences = (arr, val) =>
      arr.reduce(
        (a, v) => (JSON.stringify(v) === JSON.stringify(val) ? a + 1 : a),
        0
      );

    // Array to hold the occurrences of each serverLoc
    const counts = [];
    for (let i = 0; i < filteredServerLoc.length; i += 1) {
      // Find occurances of respected value and pushes it to counts
      counts.push(countOccurrences(mergedLocArray, filteredServerLoc[i]));
    }

    // Array to hold the data needed for heatmap
    const data = [];
    for (let j = 0; j < counts.length; j += 1) {
      data.push({
        lat: filteredServerLoc[j][0],
        lng: filteredServerLoc[j][1],
        count: counts[j],
      });
    }

    // Max and min values of occurrences
    const max = Math.max(...counts);
    const min = Math.min(...counts);

    const responeData = { max, min, data };

    return response.status(200).send(responeData);
  } catch (error) {
    return response.status(404).json({
      error: 'An error occured when trying to get files.',
    });
  }
});

module.exports = heatmapRouter;
