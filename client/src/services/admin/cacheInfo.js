/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
const baseUrl = '/admin/cacheinfo';

// Get request for ttl
const ttl = async (token) => {
  const urlToSend = `${baseUrl}/ttl`;
  const tokenToSend = `bearer ${token}`;
  const response = await axios.get(urlToSend, {
    headers: { Authorization: tokenToSend },
  });
  return response.data;
};

// Get request for request directives
const requestDirectives = async (token) => {
  const urlToSend = `${baseUrl}/requestdirectives`;
  const tokenToSend = `bearer ${token}`;
  const response = await axios.get(urlToSend, {
    headers: { Authorization: tokenToSend },
  });
  return response.data;
};

const responseDirectives = async (token) => {
  const urlToSend = `${baseUrl}/responsedirectives`;
  const tokenToSend = `bearer ${token}`;
  const response = await axios.get(urlToSend, {
    headers: { Authorization: tokenToSend },
  });
  return response.data;
};

export default { ttl, requestDirectives, responseDirectives };
