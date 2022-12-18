import axios from 'axios';
import { handleSuccess, handleError } from '../helpers/handlers';
import { baseApiUrl } from '../common/constants';

const baseUrl = `${baseApiUrl}/auth`;

export const changePassword = async (params, onSuccess, onError) => {
  axios
    .post(`${baseUrl}/reset-password`, params)
    .then((response) => handleSuccess(response, onSuccess))
    .catch((error) => handleError(error, onError));
};

export const registerUser = async (params, onSuccess, onError) => {
  axios
    .post(`${baseUrl}/registration`, params)
    .then((response) => handleSuccess(response, onSuccess))
    .catch((error) => handleError(error, onError));
};

export const loginUser = async (params, onSuccess, onError) => {
  axios
    .post(`${baseUrl}/login`, params)
    .then((response) => handleSuccess(response, onSuccess))
    .catch((error) => handleError(error, onError));
};
