import axios from 'axios';
import { config } from '../config/app.config';
import { getItem, removeItem, setItem } from '../helpers/localStorage';
import { refreshTokens } from './auth';

export const useAxios = axios.create({
  baseURL: config.API,
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

      return refreshTokens()
        .then(({ data }) => {
          setItem('jwtToken', data);

          originalRequest.headers['Authorization'] = data;
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
