// A mock function to mimic making an async request for data
import axios from 'axios';

const API_URL = '/api/users/';

export const registerUser = async (user) => {
  return await axios.post(API_URL, user);
};

export const loginUser = async (user) => {
  return await axios.post(API_URL + '/login', user);
};
