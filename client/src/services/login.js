/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
const baseUrl = '/login';

// Post request with login credentials
const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

export default { login };
