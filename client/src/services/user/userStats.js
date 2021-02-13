/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
const baseUrl = '/api/user/userstats';

// Post request with new username credentials
const userstats = async (token) => {
  const tokenToSend = `bearer ${token}`;
  const response = await axios.get(baseUrl, {
    headers: { Authorization: tokenToSend },
  });
  return response.data;
};

export default { userstats };
