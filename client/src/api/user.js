import axios from 'axios';
import { handleSuccess, handleError } from '../helpers/handlers';
import { baseApiUrl } from '../common/constants';

const baseUrl = `${baseApiUrl}/users`;

export const getUser = async (params, onSuccess, onError) => {
  axios
    .post(`${baseUrl}/profile`, params)
    .then((response) => handleSuccess(response, onSuccess))
    .catch((error) => handleError(error, onError));
};
