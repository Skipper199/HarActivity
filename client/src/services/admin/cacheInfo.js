/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
const baseUrl = '/admin/cacheinfo';

// Get request for countInfo
const ttl = async (token) => {
  const urlToSend = `${baseUrl}/ttl`;
  const tokenToSend = `bearer ${token}`;
  const response = await axios.get(urlToSend, {
    headers: { Authorization: tokenToSend },
  });
  return response.data;
};

export default { ttl };
