/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
const baseUrl = '/api/user/update';

// Post request with new username credentials
const username = async (token, credentials) => {
  const urlToSend = `${baseUrl}/username`;
  const tokenToSend = `bearer ${token}`;
  const response = await axios.put(urlToSend, credentials, {
    headers: { Authorization: tokenToSend },
  });
  return response.data;
};

// Post request with new username credentials
const password = async (token, credentials) => {
  const urlToSend = `${baseUrl}/password`;
  const tokenToSend = `bearer ${token}`;
  const response = await axios.put(urlToSend, credentials, {
    headers: { Authorization: tokenToSend },
  });
  return response.data;
};

export default { username, password };
