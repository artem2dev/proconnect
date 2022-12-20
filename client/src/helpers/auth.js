import jwt_decode from 'jwt-decode';
import { removeItem, setItem } from './localStorage';

const JWT_TOKEN = 'jwtToken';

const updateAuthToken = (token) => {
  setItem(JWT_TOKEN, token);
  const decoded = jwt_decode(token);

  return decoded;
};

export const onLogin = (token) => {
  return updateAuthToken(token);
};

export const onSignOut = () => {
  removeItem(JWT_TOKEN);
};
