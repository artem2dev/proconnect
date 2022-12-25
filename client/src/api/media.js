import axios from 'axios';
import { baseApiUrl } from '../common/constants';
import { handleError, handleSuccess } from '../helpers/handlers';
import { getItem } from '../helpers/localStorage';

const baseUrl = `${baseApiUrl}/media`;

const authHeaders = () => {
  const token = getItem('jwtToken');
  return { Authorization: token };
};

export const uploadImage = async (formData, onSuccess, onError) => {
  axios
    .post(`${baseUrl}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() },
    })
    .then((response) => handleSuccess(response, onSuccess))
    .catch((error) => handleError(error, onError));
};

export const getImage = async (onSuccess, onError) => {
  axios
    .get(`${baseUrl}/image`, {
      headers: authHeaders(),
    })
    .then((response) => handleSuccess(response, onSuccess))
    .catch((error) => handleError(error, onError));
};
