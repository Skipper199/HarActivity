/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
const baseUrl = '/api/user/upload';

// Post request with new username credentials
const upload = async (token, credentials) => {
  const xForwardedForIP = process.env.REACT_APP_IP_ADDRESS;
  const tokenToSend = `bearer ${token}`;
  const response = await axios.post(baseUrl, credentials, {
    headers: {
      Authorization: tokenToSend,
      'x-forwarded-for': xForwardedForIP,
    },
  });
  return response.data;
};

export default { upload };
