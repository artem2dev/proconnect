import axios from 'axios';
import { handleSuccess, handleError } from '../helpers/handlers';
import { baseApiUrl } from '../common/constants';

const baseUrl = `${baseApiUrl}/users`;

export const changePassword = async (params, onSuccess, onError) => {
  axios
    .post(`${baseUrl}/reset-password`, params)
    .then((response) => handleSuccess(response, onSuccess))
    .catch((error) => handleError(error, onError));
};

export const registerUser = async (params, onSuccess, onError) => {
  axios
    .post(`${baseUrl}/register`, params)
    .then((response) => handleSuccess(response, onSuccess))
    .catch((error) => handleError(error, onError));
};

export const loginUser = async (params, onSuccess, onError) => {
  axios
    .post(`${baseUrl}/login`, params)
    .then((response) => handleSuccess(response, onSuccess))
    .catch((error) => handleError(error, onError));
};
