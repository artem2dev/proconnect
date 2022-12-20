import axios from 'axios';
import * as decodeToken from 'jwt-decode';
import { removeItem, setItem } from './localStorage';

const JWT_TOKEN = 'jwtToken';

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

const updateAuthToken = (token) => {
  setItem(JWT_TOKEN, token);
  setAuthToken(token);
  const decoded = decodeToken(token);

  return decoded;
};

export const onLogin = (token) => {
  return updateAuthToken(token);
};

export const onSignOut = () => {
  setAuthToken(false);
  removeItem(JWT_TOKEN);
};
