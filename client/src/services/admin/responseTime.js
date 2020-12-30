/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
const baseUrl = '/admin/responsetime';

// Get request for countInfo
const responseTime = async (token) => {
  const urlToSend = `${baseUrl}`;
  const tokenToSend = `bearer ${token}`;
  const response = await axios.get(urlToSend, {
    headers: { Authorization: tokenToSend },
  });
  return response.data;
};

export default { responseTime };
