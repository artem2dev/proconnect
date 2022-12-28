import { baseApiUrl } from '../common/constants';
import { handleError, handleSuccess } from '../helpers/handlers';
import { useAxios } from './axiosConfig';

const baseUrl = `${baseApiUrl}/users`;

export const getUser = async (onSuccess, onError) => {
  useAxios
    .get('/profile')
    .then((response) => handleSuccess(response, onSuccess))
    .catch((error) => handleError(error, onError));
};

export const updateUser = async (params, onSuccess, onError) => {
  useAxios
    .put(`${baseUrl}/profile`, params)
    .then((response) => handleSuccess(response, onSuccess))
    .catch((error) => handleError(error, onError));
};
