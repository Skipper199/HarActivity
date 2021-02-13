/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
const baseUrl = '/api/admin/flowmap';

// Get request for flowmap
const flowmap = async (token) => {
  const urlToSend = `${baseUrl}`;
  const tokenToSend = `bearer ${token}`;
  const response = await axios.get(urlToSend, {
    headers: { Authorization: tokenToSend },
  });
  return response.data;
};

export default { flowmap };
