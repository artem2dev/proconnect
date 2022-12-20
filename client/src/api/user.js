import axios from 'axios';
import { baseApiUrl } from '../common/constants';
import { handleError, handleSuccess } from '../helpers/handlers';
import { getItem } from '../helpers/localStorage';

const baseUrl = `${baseApiUrl}/users`;

const token = getItem('jwtToken');
const headers = { Authorization: token };

export const getUser = async (onSuccess, onError) => {
  axios
    .get(`${baseUrl}/profile`, { headers })
    .then((response) => handleSuccess(response, onSuccess))
    .catch((error) => handleError(error, onError));
};
