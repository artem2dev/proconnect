import { handleSuccess, handleError } from '../helpers/handlers';
import { baseApiUrl } from '../common/constants';
import { useAxios } from './axiosConfig';

const baseUrl = `${baseApiUrl}/auth`;

export const changePassword = async (params, onSuccess, onError) => {
  useAxios
    .post(`${baseUrl}/reset-password`, params)
    .then((response) => handleSuccess(response, onSuccess))
    .catch((error) => handleError(error, onError));
};

export const registerUser = async (params, onSuccess, onError) => {
  useAxios
    .post(`${baseUrl}/registration`, params, { withCredentials: true })
    .then((response) => handleSuccess(response, onSuccess))
    .catch((error) => handleError(error, onError));
};

export const loginUser = async (params, onSuccess, onError) => {
  useAxios
    .post(`${baseUrl}/login`, params, { withCredentials: true })
    .then((response) => handleSuccess(response, onSuccess))
    .catch((error) => handleError(error, onError));
};

export const refreshTokens = async (onSuccess, onError) => {
  useAxios
    .get(`${baseUrl}/refresh`, { withCredentials: true })
    .then((response) => handleSuccess(response, onSuccess))
    .catch((error) => handleError(error, onError));
};
