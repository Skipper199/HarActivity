/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
const baseUrl = '/signup';

// Post request with signup credentials
const signup = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

export default { signup };
