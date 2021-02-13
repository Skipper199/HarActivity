/* eslint-disable array-callback-return */
/* eslint-disable no-loop-func */
const jwt = require('jsonwebtoken');
const requestDirectivesRouter = require('express').Router();
const User = require('../../../models/user');
const HarFile = require('../../../models/harFile');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

requestDirectivesRouter.get('/', async (request, response, next) => {
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

    const requestHeaders = uploadedFiles.map((outer) => ({
      isp: outer.upload.isp,
      headers: outer.harRequests
        .map((inner) => {
          if (
            inner.request.headers &&
            inner.request.headers.contentType &&
            inner.request.headers.contentType.includes('/')
          ) {
            const obj = {
              contentType: inner.request.headers.contentType.split(';')[0],
            };
            if (inner.request.headers.cacheControl) {
              obj.cacheControl = inner.request.headers.cacheControl;
            }
            return obj;
          }
        })
        .filter((item) => item !== undefined),
    }));

    const allISPRequests = requestHeaders.map((item) => item.headers).flat(1);

    const allDistinctContentTypes = [...new Set(allISPRequests.map((item) => item.contentType))];

    const data = [];
    const chartData = [];
    for (let i = 0; i < allDistinctContentTypes.length; i += 1) {
      let denominator = 0;
      let maxStaleNumerator = 0;
      let minFreshNumerator = 0;

      for (let j = 0; j < allISPRequests.length; j += 1) {
        if (allDistinctContentTypes[i] === allISPRequests[j].contentType) {
          denominator += 1;

          if (
            allISPRequests[j].cacheControl &&
            allISPRequests[j].cacheControl.includes('max-stale')
          ) {
            maxStaleNumerator += 1;
          }
          if (
            allISPRequests[j].cacheControl &&
            allISPRequests[j].cacheControl.includes('min-fresh=')
          ) {
            minFreshNumerator += 1;
          }
        }
      }

      const maxStalePercentage = (maxStaleNumerator / denominator) * 100;
      const minFreshPercentage = (minFreshNumerator / denominator) * 100;

      const maxMinArray = [maxStalePercentage.toFixed(2), minFreshPercentage.toFixed(2)];

      if (maxStaleNumerator !== 0 || minFreshNumerator !== 0) {
        data.push({
          contentType: allDistinctContentTypes[i],
          maxMinArray,
        });
      }
    }

    chartData.push({ isp: 'Nothing', data });

    // Distinct ISPs
    const distinctISPs = [...new Set(requestHeaders.map((item) => item.isp))];

    // Groups data based on ISP
    const groupedInfoArray = [];
    for (let i = 0; i < distinctISPs.length; i += 1) {
      const dataISP = [];
      for (let j = 0; j < requestHeaders.length; j += 1) {
        if (distinctISPs[i] === requestHeaders[j].isp) {
          dataISP.push(requestHeaders[j].headers);
        }
      }
      groupedInfoArray.push({ isp: distinctISPs[i], data: dataISP.flat(1) });
    }

    for (let k = 0; k < groupedInfoArray.length; k += 1) {
      const innerArray = groupedInfoArray[k].data;

      const data = [];
      for (let i = 0; i < allDistinctContentTypes.length; i += 1) {
        let denominator = 0;
        let maxStaleNumerator = 0;
        let minFreshNumerator = 0;

        for (let j = 0; j < innerArray.length; j += 1) {
          if (allDistinctContentTypes[i] === innerArray[j].contentType) {
            denominator += 1;

            if (innerArray[j].cacheControl && innerArray[j].cacheControl.includes('max-stale')) {
              maxStaleNumerator += 1;
            }
            if (innerArray[j].cacheControl && innerArray[j].cacheControl.includes('min-fresh=')) {
              minFreshNumerator += 1;
            }
          }
        }

        const maxStalePercentage = (maxStaleNumerator / denominator) * 100;
        const minFreshPercentage = (minFreshNumerator / denominator) * 100;

        const maxMinArray = [maxStalePercentage.toFixed(2), minFreshPercentage.toFixed(2)];

        if (maxStaleNumerator !== 0 || minFreshNumerator !== 0) {
          data.push({
            contentType: allDistinctContentTypes[i],
            maxMinArray,
          });
        }
      }

      chartData.push({ isp: groupedInfoArray[k].isp, data });
    }

    return response.status(200).send(chartData);
  } catch (error) {
    next(error);
  }
});

module.exports = requestDirectivesRouter;
