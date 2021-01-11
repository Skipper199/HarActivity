/* eslint-disable array-callback-return */
/* eslint-disable no-loop-func */
const jwt = require('jsonwebtoken');
const d3Array = require('d3-array');
const ttlRouter = require('express').Router();
const User = require('../../../models/user');
const HarFile = require('../../../models/harFile');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

ttlRouter.get('/', async (request, response, next) => {
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

    // Returns all the necessary information
    const infoArray = uploadedFiles.map((outer) => ({
      isp: outer.upload.isp,
      data: outer.harRequests
        .map((inner) => {
          // Make sure contentType and info to calculate ttl exist
          if (
            inner.response.headers &&
            inner.response.headers.contentType &&
            inner.response.headers.contentType.includes('/') &&
            ((inner.response.headers.cacheControl &&
              inner.response.headers.cacheControl.includes('max-age=')) ||
              (inner.response.headers.expires !== -1 &&
                inner.response.headers.expires &&
                inner.response.headers.lastModified))
          ) {
            const obj = {};

            obj.contentType = inner.response.headers.contentType.split(';')[0];

            if (
              inner.response.headers.cacheControl &&
              inner.response.headers.cacheControl.includes('max-age=')
            ) {
              obj.ttl = parseInt(
                inner.response.headers.cacheControl
                  .split(',')
                  .filter((item) => item.includes('max-age='))[0]
                  .split('=')[1]
              );
            } else if (
              inner.response.headers.expires !== -1 &&
              inner.response.headers.expires &&
              inner.response.headers.lastModified
            ) {
              const expires = new Date(inner.response.headers.expires);
              const lastModified = new Date(
                inner.response.headers.lastModified
              );
              const secDiffTtl =
                (expires.getTime() - lastModified.getTime()) / 1000;

              if (secDiffTtl >= 0) {
                obj.ttl = secDiffTtl;
              }
            }

            return obj;
          }
        })
        .filter((item) => item !== undefined)
        .filter((item) => item.ttl !== undefined),
    }));

    const distinctISP = [...new Set(infoArray.map((item) => item.isp))];
    const distinctContentTypes = [
      ...new Set(
        infoArray
          .map((outer) =>
            outer.data.map((inner) => {
              if (inner.contentType) return inner.contentType;
            })
          )
          .flat(1)
          .filter((item) => item !== undefined)
      ),
    ];

    const bucketIntervals = (buckets, minTtl) => {
      buckets.unshift(minTtl);

      const intervalsString = [];
      for (let i = 0; i < buckets.length - 1; i += 1) {
        intervalsString.push(
          buckets[i]
            .toFixed(2)
            .toString()
            .concat(' - ', buckets[i + 1].toFixed(2).toString())
        );
      }

      return intervalsString;
    };

    // Array to keep the response data
    const histogramData = [];

    // Keep info from all ISPs together
    const allInfoArray = infoArray.map((item) => item.data).flat(1);

    // Create the buckets array
    const minTtl = Math.min(...allInfoArray.map((item) => item.ttl));
    const maxTtl = Math.max(...allInfoArray.map((item) => item.ttl));

    const interval = (maxTtl - minTtl) / 10;

    const buckets = [];
    for (let i = minTtl; i <= maxTtl; i += interval) {
      if (i > minTtl) {
        buckets.push(i);
      }
    }

    buckets.pop(1);
    buckets.push(maxTtl);

    // Store data for every ISP grouped by contentType
    const data = [];
    for (let i = 0; i < distinctContentTypes.length; i += 1) {
      const occurences = new Array(10).fill(0);
      for (let j = 0; j < allInfoArray.length; j += 1) {
        if (distinctContentTypes[i] === allInfoArray[j].contentType) {
          const index = d3Array.bisectLeft(buckets, allInfoArray[j].ttl);
          occurences[index] += 1;
        }
      }

      const arraySum = occurences.reduce((a, b) => a + b, 0);
      if (arraySum !== 0) {
        data.push({
          contentType: distinctContentTypes[i],
          occurences,
        });
      }
    }

    histogramData.push({
      isp: 'Nothing',
      buckets: bucketIntervals(buckets, minTtl),
      data,
    });

    // Groups data based on ISP
    const groupedInfoArray = [];
    for (let i = 0; i < distinctISP.length; i += 1) {
      const dataISP = [];
      for (let j = 0; j < infoArray.length; j += 1) {
        if (distinctISP[i] === infoArray[j].isp) {
          dataISP.push(infoArray[j].data);
        }
      }
      groupedInfoArray.push({ isp: distinctISP[i], data: dataISP.flat(1) });
    }

    for (let k = 0; k < distinctISP.length; k += 1) {
      const innerArray = groupedInfoArray[k].data;

      // Create the buckets array
      const minTtl = Math.min(...innerArray.map((item) => item.ttl));
      const maxTtl = Math.max(...innerArray.map((item) => item.ttl));

      const interval = (maxTtl - minTtl) / 10;

      const buckets = [];
      for (let i = minTtl; i <= maxTtl; i += interval) {
        if (i > minTtl) {
          buckets.push(i);
        }
      }

      buckets.pop(1);
      buckets.push(maxTtl);

      // Store data for every ISP grouped by contentType
      const data = [];
      for (let i = 0; i < distinctContentTypes.length; i += 1) {
        const occurences = new Array(10).fill(0);
        for (let j = 0; j < innerArray.length; j += 1) {
          if (distinctContentTypes[i] === innerArray[j].contentType) {
            const index = d3Array.bisectLeft(buckets, innerArray[j].ttl);
            occurences[index] += 1;
          }
        }

        const arraySum = occurences.reduce((a, b) => a + b, 0);
        if (arraySum !== 0) {
          data.push({
            contentType: distinctContentTypes[i],
            occurences,
          });
        }
      }

      histogramData.push({
        isp: distinctISP[k],
        buckets: bucketIntervals(buckets, minTtl),
        data,
      });
    }
    return response.status(200).send(histogramData);
  } catch (error) {
    next(error);
  }
});

module.exports = ttlRouter;
