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

export default { numberOfUsers };
