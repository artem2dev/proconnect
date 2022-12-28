import axios from 'axios';
import { baseApiUrl } from '../common/constants';
import { setItem, getItem } from '../helpers/localStorage';
import { refreshTokens } from './auth';

const baseUrl = `${baseApiUrl}/users`;

const authHeaders = () => {
  const token = getItem('jwtToken');
  return { Authorization: token };
};

export const useAxios = axios.create({
  baseURL: `${baseUrl}`,
  headers: authHeaders(),
});

useAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const onSuccess = (token) => {
        setItem('jwtToken', token);

        (() => {
          originalRequest.headers['Authorization'] = token;
          
          return useAxios.request(originalRequest);
        })();
      };

      const onError = () => {
        window.location.href = '/login';
      };

      refreshTokens(onSuccess, onError);
    }
    return Promise.reject(error);
  },
);
