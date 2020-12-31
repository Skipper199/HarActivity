/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
const baseUrl = '/upload';

// Post request with new username credentials
const upload = async (token, credentials) => {
  const tokenToSend = `bearer ${token}`;
  const response = await axios.post(baseUrl, credentials, {
    headers: {
      Authorization: tokenToSend,
      'x-forwarded-for': '176.58.225.185',
    },
  });
  return response.data;
};

export default { upload };
