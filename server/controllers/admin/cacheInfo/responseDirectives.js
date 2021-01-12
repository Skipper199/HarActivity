/* eslint-disable array-callback-return */
/* eslint-disable no-loop-func */
const jwt = require('jsonwebtoken');
const responseDirectivesRouter = require('express').Router();
const User = require('../../../models/user');
const HarFile = require('../../../models/harFile');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

responseDirectivesRouter.get('/', async (request, response, next) => {
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

    const responseHeaders = uploadedFiles.map((outer) => ({
      isp: outer.upload.isp,
      headers: outer.harRequests
        .map((inner) => {
          if (
            inner.response.headers &&
            inner.response.headers.contentType &&
            inner.response.headers.contentType.includes('/')
          ) {
            const obj = {
              contentType: inner.response.headers.contentType.split(';')[0],
            };
            if (inner.response.headers.cacheControl) {
              obj.cacheControl = inner.response.headers.cacheControl;
            }
            return obj;
          }
        })
        .filter((item) => item !== undefined),
    }));

    const allISPResponses = responseHeaders.map((item) => item.headers).flat(1);

    const allDistinctContentTypes = [
      ...new Set(allISPResponses.map((item) => item.contentType)),
    ];

    const data = [];
    const chartData = [];
    for (let i = 0; i < allDistinctContentTypes.length; i += 1) {
      let denominator = 0;
      let privateNumerator = 0;
      let publicNumerator = 0;
      let noCacheNumerator = 0;
      let noStoreNumerator = 0;

      for (let j = 0; j < allISPResponses.length; j += 1) {
        if (allDistinctContentTypes[i] === allISPResponses[j].contentType) {
          denominator += 1;

          if (
            allISPResponses[j].cacheControl &&
            allISPResponses[j].cacheControl.includes('private')
          ) {
            privateNumerator += 1;
          }
          if (
            allISPResponses[j].cacheControl &&
            allISPResponses[j].cacheControl.includes('public')
          ) {
            publicNumerator += 1;
          }
          if (
            allISPResponses[j].cacheControl &&
            allISPResponses[j].cacheControl.includes('no-cache')
          ) {
            noCacheNumerator += 1;
          }
          if (
            allISPResponses[j].cacheControl &&
            allISPResponses[j].cacheControl.includes('no-store')
          ) {
            noStoreNumerator += 1;
          }
        }
      }

      const privatePercentage = (privateNumerator / denominator) * 100;
      const publicPercentage = (publicNumerator / denominator) * 100;
      const noCachePercentage = (noCacheNumerator / denominator) * 100;
      const noStorePercentage = (noStoreNumerator / denominator) * 100;

      const cacheabilityDirectivesArray = [
        privatePercentage.toFixed(2),
        publicPercentage.toFixed(2),
        noCachePercentage.toFixed(2),
        noStorePercentage.toFixed(2),
      ];

      if (
        privateNumerator !== 0 ||
        publicNumerator !== 0 ||
        noCacheNumerator !== 0 ||
        noStoreNumerator !== 0
      ) {
        data.push({
          contentType: allDistinctContentTypes[i],
          cacheabilityDirectivesArray,
        });
      }
    }

    chartData.push({ isp: 'Nothing', data });

    // Distinct ISPs
    const distinctISPs = [...new Set(responseHeaders.map((item) => item.isp))];

    // Groups data based on ISP
    const groupedInfoArray = [];
    for (let i = 0; i < distinctISPs.length; i += 1) {
      const dataISP = [];
      for (let j = 0; j < responseHeaders.length; j += 1) {
        if (distinctISPs[i] === responseHeaders[j].isp) {
          dataISP.push(responseHeaders[j].headers);
        }
      }
      groupedInfoArray.push({ isp: distinctISPs[i], data: dataISP.flat(1) });
    }

    for (let k = 0; k < groupedInfoArray.length; k += 1) {
      const innerArray = groupedInfoArray[k].data;

      const data = [];
      for (let i = 0; i < allDistinctContentTypes.length; i += 1) {
        let denominator = 0;
        let privateNumerator = 0;
        let publicNumerator = 0;
        let noCacheNumerator = 0;
        let noStoreNumerator = 0;

        for (let j = 0; j < innerArray.length; j += 1) {
          if (allDistinctContentTypes[i] === innerArray[j].contentType) {
            denominator += 1;

            if (
              allISPResponses[j].cacheControl &&
              allISPResponses[j].cacheControl.includes('private')
            ) {
              privateNumerator += 1;
            }
            if (
              allISPResponses[j].cacheControl &&
              allISPResponses[j].cacheControl.includes('public')
            ) {
              publicNumerator += 1;
            }
            if (
              allISPResponses[j].cacheControl &&
              allISPResponses[j].cacheControl.includes('no-cache')
            ) {
              noCacheNumerator += 1;
            }
            if (
              allISPResponses[j].cacheControl &&
              allISPResponses[j].cacheControl.includes('no-store')
            ) {
              noStoreNumerator += 1;
            }
          }
        }

        const privatePercentage = (privateNumerator / denominator) * 100;
        const publicPercentage = (publicNumerator / denominator) * 100;
        const noCachePercentage = (noCacheNumerator / denominator) * 100;
        const noStorePercentage = (noStoreNumerator / denominator) * 100;

        const cacheabilityDirectivesArray = [
          privatePercentage.toFixed(2),
          publicPercentage.toFixed(2),
          noCachePercentage.toFixed(2),
          noStorePercentage.toFixed(2),
        ];

        if (
          privateNumerator !== 0 ||
          publicNumerator !== 0 ||
          noCacheNumerator !== 0 ||
          noStoreNumerator !== 0
        ) {
          data.push({
            contentType: allDistinctContentTypes[i],
            cacheabilityDirectivesArray,
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

module.exports = responseDirectivesRouter;
