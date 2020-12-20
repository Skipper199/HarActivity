/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
const baseUrl = '/admin/generalinfo';

// Post request with new username credentials
const numberOfUsers = async (token) => {
  const urlToSend = `${baseUrl}/numberofusers`;
  const tokenToSend = `bearer ${token}`;
  const response = await axios.get(urlToSend, {
    headers: { Authorization: tokenToSend },
  });
  return response.data;
};

// Post request with new username credentials
const numberOfMethods = async (token) => {
  const urlToSend = `${baseUrl}/numberofmethods`;
  const tokenToSend = `bearer ${token}`;
  const response = await axios.get(urlToSend, {
    headers: { Authorization: tokenToSend },
  });
  return response.data;
};

// Post request with new username credentials
const numberOfStatus = async (token) => {
  const urlToSend = `${baseUrl}/numberofstatus`;
  const tokenToSend = `bearer ${token}`;
  const response = await axios.get(urlToSend, {
    headers: { Authorization: tokenToSend },
  });
  return response.data;
};

const numberOfDomains = async (token) => {
  const urlToSend = `${baseUrl}/numberofdomains`;
  const tokenToSend = `bearer ${token}`;
  const response = await axios.get(urlToSend, {
    headers: { Authorization: tokenToSend },
  });
  return response.data;
};

const numberOfISPs = async (token) => {
  const urlToSend = `${baseUrl}/numberofisps`;
  const tokenToSend = `bearer ${token}`;
  const response = await axios.get(urlToSend, {
    headers: { Authorization: tokenToSend },
  });
  return response.data;
};

export default {
  numberOfUsers,
  numberOfMethods,
  numberOfStatus,
  numberOfDomains,
  numberOfISPs,
};
