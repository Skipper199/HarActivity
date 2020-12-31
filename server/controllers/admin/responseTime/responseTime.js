/* eslint-disable array-callback-return */
/* eslint-disable no-loop-func */
const jwt = require('jsonwebtoken');
const responseTimeRouter = require('express').Router();
const User = require('../../../models/user');
const HarFile = require('../../../models/harFile');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

responseTimeRouter.get('/', async (request, response, next) => {
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
    /* ************************************************
    ***************************************************
                Initial data without grouping
    ***************************************************
    ************************************************ */

    // Find all the uploaded files
    const uploadedFiles = await HarFile.find();

    // Returns all the responses
    const waitArray = uploadedFiles.map((outer) =>
      outer.harRequests.map((inner) => ({
        startedDateTime: inner.startedDateTime,
        wait: inner.timings.wait,
      }))
    );

    // Merges all the wait times into one array
    const mergedWaitArray = waitArray.flat(1);

    const sum = new Array(24).fill(0);
    const occurances = new Array(24).fill(0);

    for (let i = 0; i < mergedWaitArray.length; i += 1) {
      const index = new Date(mergedWaitArray[i].startedDateTime).getHours();

      sum[index] += mergedWaitArray[i].wait;
      occurances[index] += 1;
    }

    const avgWaitTimes = new Array(24).fill(0);

    for (let i = 0; i < sum.length; i += 1) {
      if (occurances[i] !== 0) {
        avgWaitTimes[i] = sum[i] / occurances[i];
      }
    }

    const arr0 = [
      {
        name: 'Response Time',
        wait: avgWaitTimes.map((item) => item.toFixed(3)),
      },
    ];

    /* ************************************************
    ***************************************************
              Data grouped by content types
    ***************************************************
    ************************************************ */

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
    // Keeps only the media-type
    const splitContentTypeArray = filteredContentTypeArray.map(
      (item) => item.split(';')[0]
    );

    const filteredSplitContentTypeArray = splitContentTypeArray.filter((item) =>
      item.includes('/')
    );

    const distinctContentTypeArray = [
      ...new Set(filteredSplitContentTypeArray),
    ];

    // Return the data needed
    const responseDateArray = uploadedFiles.map((outer) =>
      outer.harRequests.map((inner) => {
        if (inner.response.headers && inner.response.headers.contentType)
          return {
            contentType: inner.response.headers.contentType,
            startedDateTime: inner.startedDateTime,
            wait: inner.timings.wait,
          };
      })
    );

    const mergedDateResponseArray = responseDateArray.flat(1);

    // Removes undefined values
    const filteredResponseDateArray = mergedDateResponseArray.filter(
      (x) => x !== undefined
    );

    const arr1 = [];

    for (let i = 0; i < distinctContentTypeArray.length; i += 1) {
      const sum = new Array(24).fill(0);
      const occurances = new Array(24).fill(0);

      filteredResponseDateArray.map((item) => {
        const regex = new RegExp(`${distinctContentTypeArray[i]}`);

        if (regex.test(item.contentType)) {
          const index = new Date(item.startedDateTime).getHours();
          sum[index] += item.wait;
          occurances[index] += 1;
        }
      });

      const avgWaitTimes = new Array(24).fill(0);

      for (let j = 0; j < sum.length; j += 1) {
        if (occurances[j] !== 0) {
          avgWaitTimes[j] = sum[j] / occurances[j];
        }
      }

      arr1.push({
        name: distinctContentTypeArray[i],
        wait: avgWaitTimes.map((item) => item.toFixed(3)),
      });
    }

    /* ************************************************
    ***************************************************
            Data grouped by day of the week
    ***************************************************
    ************************************************ */

    const daysOfTheWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const arr2 = [];

    for (let i = 0; i < 7; i += 1) {
      const sum = new Array(24).fill(0);
      const occurances = new Array(24).fill(0);

      mergedWaitArray.map((item) => {
        const day = new Date(item.startedDateTime).getDay();

        if (i === day) {
          const index = new Date(item.startedDateTime).getHours();
          sum[index] += item.wait;
          occurances[index] += 1;
        }
      });

      const avgWaitTimes = new Array(24).fill(0);

      for (let j = 0; j < sum.length; j += 1) {
        if (occurances[j] !== 0) {
          avgWaitTimes[j] = sum[j] / occurances[j];
        }
      }

      arr2.push({
        name: daysOfTheWeek[i],
        wait: avgWaitTimes.map((item) => item.toFixed(3)),
      });
    }

    /* ************************************************
    ***************************************************
                Data grouped by http method
    ***************************************************
    ************************************************ */

    // Returns all the responses
    const waitMethodArray = uploadedFiles.map((outer) =>
      outer.harRequests.map((inner) => ({
        method: inner.request.method,
        startedDateTime: inner.startedDateTime,
        wait: inner.timings.wait,
      }))
    );

    // Merges all the wait times into one array
    const mergedWaitMethodArray = waitMethodArray.flat(1);

    // Returns only the method arrays
    const methodArray = uploadedFiles.map((outer) =>
      outer.harRequests.map((inner) => inner.request.method)
    );

    // Merges all the methods arrays into one
    const mergedMethodArray = methodArray.flat(1);

    // Returns a set from an array (Keeps only distinct values)
    const distinctMethodSet = [...new Set(mergedMethodArray)];

    // Returns an array from previous set
    const distinctMethodArray = Array.from(distinctMethodSet);

    const arr3 = [];

    for (let i = 0; i < distinctMethodArray.length; i += 1) {
      const sum = new Array(24).fill(0);
      const occurances = new Array(24).fill(0);

      mergedWaitMethodArray.map((item) => {
        if (distinctMethodArray[i] === item.method) {
          const index = new Date(item.startedDateTime).getHours();
          sum[index] += item.wait;
          occurances[index] += 1;
        }
      });

      const avgWaitTimes = new Array(24).fill(0);

      for (let j = 0; j < sum.length; j += 1) {
        if (occurances[j] !== 0) {
          avgWaitTimes[j] = sum[j] / occurances[j];
        }
      }

      arr3.push({
        name: distinctMethodArray[i],
        wait: avgWaitTimes.map((item) => item.toFixed(3)),
      });
    }

    /* ************************************************
    ***************************************************
                    Data grouped by ISPs
    ***************************************************
    ************************************************ */

    // Returns only the ISPs
    const ispArray = uploadedFiles.map((item) => item.upload.isp);

    // Returns a set from an array (Keeps only distinct values)
    const distinctISPSet = [...new Set(ispArray)];

    // Returns an array from previous set
    const distinctISPArray = Array.from(distinctISPSet);

    // Returns all the data needed
    const waitISPArray = uploadedFiles.map((outer) =>
      outer.harRequests.map((inner) => ({
        isp: outer.upload.isp,
        startedDateTime: inner.startedDateTime,
        wait: inner.timings.wait,
      }))
    );

    // Merges all the wait times into one array
    const mergedWaitISPArray = waitISPArray.flat(1);

    const arr4 = [];

    for (let i = 0; i < distinctISPArray.length; i += 1) {
      const sum = new Array(24).fill(0);
      const occurances = new Array(24).fill(0);

      mergedWaitISPArray.map((item) => {
        if (distinctISPArray[i] === item.isp) {
          const index = new Date(item.startedDateTime).getHours();
          sum[index] += item.wait;
          occurances[index] += 1;
        }
      });

      const avgWaitTimes = new Array(24).fill(0);

      for (let j = 0; j < sum.length; j += 1) {
        if (occurances[j] !== 0) {
          avgWaitTimes[j] = sum[j] / occurances[j];
        }
      }

      arr4.push({
        name: distinctISPArray[i],
        wait: avgWaitTimes.map((item) => item.toFixed(3)),
      });
    }

    return response.status(200).send([arr0, arr1, arr2, arr3, arr4]);
  } catch (error) {
    next(error);
  }
});

module.exports = responseTimeRouter;
