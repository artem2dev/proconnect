import { setGlobalState } from '../redux/globalState';
import { setUser } from '../redux/usersSlice';
import { removeItem, setItem } from './localStorage';

const JWT_TOKEN = 'jwtToken';

const updateAuthToken = (token) => {
  setItem(JWT_TOKEN, token);
};

export const onLogin = (token) => {
  return updateAuthToken(token);
};

export const onSignOut = (dispatch) => {
  removeItem(JWT_TOKEN);
  dispatch(setUser({}));
  dispatch(setGlobalState({ sidebarVisible: false }));
};
