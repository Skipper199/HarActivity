/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
const baseUrl = '/admin/generalinfo';

// Get request for countInfo
const countInfo = async (token) => {
  const urlToSend = `${baseUrl}/countinfo`;
  const tokenToSend = `bearer ${token}`;
  const response = await axios.get(urlToSend, {
    headers: { Authorization: tokenToSend },
  });
  return response.data;
};

// Get request for number of methods
const numberOfMethods = async (token) => {
  const urlToSend = `${baseUrl}/numberofmethods`;
  const tokenToSend = `bearer ${token}`;
  const response = await axios.get(urlToSend, {
    headers: { Authorization: tokenToSend },
  });
  return response.data;
};

// Get request for number of status
const numberOfStatus = async (token) => {
  const urlToSend = `${baseUrl}/numberofstatus`;
  const tokenToSend = `bearer ${token}`;
  const response = await axios.get(urlToSend, {
    headers: { Authorization: tokenToSend },
  });
  return response.data;
};

export default {
  numberOfMethods,
  numberOfStatus,
  countInfo,
};
