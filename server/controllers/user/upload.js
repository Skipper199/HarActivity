const axios = require('axios');
const jwt = require('jsonwebtoken');
const uploadRouter = require('express').Router();
const User = require('../../models/user');
const HarFile = require('../../models/harFile');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

// Handle update username request
uploadRouter.post('/', async (request, response) => {
  const { body } = request;
  const token = getTokenFrom(request);

  const decodedToken = jwt.verify(token, process.env.SECRET);

  // Return error if token is missing or invalid
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'Token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);

  const { ip } = request;
  const clientInfo = await axios.get(`http://ipwhois.app/json/${ip}`);

  const { harRequests } = body;

  const promises = [];

  for (let i = 0; i < harRequests.length; i += 1) {
    promises.push(
      axios
        .get(
          `https://get.geojs.io/v1/ip/geo/${harRequests[i].serverIPAddress}.json`
        )
        .then((serverInfo) => {
          // do something with response
          const serverLoc = [
            parseFloat(serverInfo.data.latitude),
            parseFloat(serverInfo.data.longitude),
          ];

          harRequests[i].serverLoc = serverLoc;
        })
    );
  }

  Promise.allSettled(promises).then(async () => {
    // After all requests are done

    // Creates new user
    const harFile = new HarFile({
      upload: {
        date: new Date(),
        isp: clientInfo.data.isp,
        geoLoc: [clientInfo.data.latitude, clientInfo.data.longitude],
      },
      harRequests,
      user: user._id,
    });

    try {
      const savedHarFile = await harFile.save();
      user.harFiles = user.harFiles.concat(savedHarFile._id);
      await user.save();
      return response.status(200).send({
        message: 'Har file uploaded successfully!',
      });
    } catch (error) {
      console.log(error);
      return response.status(404).json({
        error: 'An error occured in the upload proccess.',
      });
    }
  });
});

module.exports = uploadRouter;
