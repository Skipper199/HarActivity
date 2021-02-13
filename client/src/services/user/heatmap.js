/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
const baseUrl = '/api/user/heatmap';

// Post request with new username credentials
const heatmap = async (token) => {
  const tokenToSend = `bearer ${token}`;
  const response = await axios.get(baseUrl, {
    headers: { Authorization: tokenToSend },
  });
  return response.data;
};

export default { heatmap };
