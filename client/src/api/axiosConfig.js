import axios from 'axios';
import { baseApiUrl } from '../common/constants';
import { getItem, removeItem, setItem } from '../helpers/localStorage';
import { refreshTokens } from './auth';

const baseUrl = `${baseApiUrl}`;

export const useAxios = axios.create({
  baseURL: `${baseUrl}`,
});
useAxios.interceptors.request.use((config) => {
  config.headers.Authorization = getItem('jwtToken');

  return config;
});

useAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      refreshTokens()
        .then((data) => {
          setItem('jwtToken', data.token);

          originalRequest.headers['Authorization'] = data.token;
          return useAxios.request(originalRequest);
        })
        .catch(() => {
          window.location.href = '/login';
          removeItem('jwtToken');
        });
    }
    return Promise.reject(error);
  },
);
