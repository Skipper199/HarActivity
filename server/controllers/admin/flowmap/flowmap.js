/* eslint-disable array-callback-return */
/* eslint-disable no-loop-func */
const jwt = require('jsonwebtoken');
const flowmapRouter = require('express').Router();
const User = require('../../../models/user');
const HarFile = require('../../../models/harFile');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

flowmapRouter.get('/', async (request, response, next) => {
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
    // Function to find distinct geo locations
    const findDistinctLocations = (geoLoc) => {
      const distinctAsString = [];
      const distinctGeoLoc = [];
      for (let i = 0; i < geoLoc.length; i += 1) {
        if (!distinctAsString.includes(JSON.stringify(geoLoc[i]))) {
          distinctAsString.push(JSON.stringify(geoLoc[i]));
          distinctGeoLoc.push(geoLoc[i]);
        }
      }
      return distinctGeoLoc;
    };

    // Find all the uploaded files
    const uploadedFiles = await HarFile.find();

    // Info for origin geolocation
    const geoLocOrigin = uploadedFiles.map((elem) => elem.upload.geoLoc);

    const distinctGeoLocOrigin = findDistinctLocations(geoLocOrigin);

    const originLocations = distinctGeoLocOrigin.map((elem, index) => ({
      id: index + 1,
      geoLoc: { lat: elem[0], lon: elem[1] },
    }));

    // Info for destination geolocation
    const geoLocDest = uploadedFiles
      .map((outer) =>
        outer.harRequests
          .map((inner) => inner.serverLoc)
          .filter((item) => item !== undefined)
      )
      .flat(1);

    const distinctGeoLocDest = findDistinctLocations(geoLocDest);

    const destinationLocations = distinctGeoLocDest.map((elem, index) => ({
      id: originLocations.length + index + 1,
      geoLoc: { lat: elem[0], lon: elem[1] },
    }));

    // Keep the route data
    const routesData = originLocations.map((outer) => ({
      id: outer.id,
      originGeoLoc: outer.geoLoc,
      destinationsGeoLoc: uploadedFiles
        .map((inner) => {
          const geoLocObj = {
            lat: inner.upload.geoLoc[0],
            lon: inner.upload.geoLoc[1],
          };
          const destinations = [];
          if (JSON.stringify(outer.geoLoc) === JSON.stringify(geoLocObj)) {
            inner.harRequests.map((item) => {
              if (item.serverLoc)
                destinations.push({
                  lat: item.serverLoc[0],
                  lon: item.serverLoc[1],
                });
            });
            return destinations;
          }
        })
        .filter((x) => x !== undefined)
        .flat(1),
    }));

    const flows = [];

    for (let i = 0; i < routesData.length; i += 1) {
      const routeData = routesData[i];
      for (let j = 0; j < routeData.destinationsGeoLoc.length; j += 1) {
        let destinationID = -1;

        for (let k = 0; k < destinationLocations.length; k += 1) {
          if (
            JSON.stringify(destinationLocations[k].geoLoc) ===
            JSON.stringify(routeData.destinationsGeoLoc[j])
          ) {
            destinationID = originLocations.length + k + 1;
            break;
          }
        }

        let included = false;

        for (let k = 0; k < flows.length; k += 1) {
          if (
            JSON.stringify({
              origin: flows[k].origin,
              dest: flows[k].dest,
            }) === JSON.stringify({ origin: routeData.id, dest: destinationID })
          ) {
            flows[k].count += 1;
            included = true;
          }
        }

        if (!included) {
          flows.push({
            origin: routeData.id,
            dest: destinationID,
            count: 1,
          });
        }
      }
    }

    const locations = originLocations
      .map((item) => ({
        id: item.id,
        lat: item.geoLoc.lat,
        lon: item.geoLoc.lon,
      }))
      .concat(
        destinationLocations.map((item) => ({
          id: item.id,
          lat: item.geoLoc.lat,
          lon: item.geoLoc.lon,
        }))
      );

    console.log(locations);
    console.log(flows);

    return response.status(200).send({ locations, flows });
  } catch (error) {
    next(error);
  }
});

module.exports = flowmapRouter;
