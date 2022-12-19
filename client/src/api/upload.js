import axios from 'axios';
import { handleSuccess, handleError } from '../helpers/handlers';
import { baseApiUrl } from '../common/constants';

const baseUrl = `${baseApiUrl}/upload`;

export const uploadImage = async (formData, config, onSuccess, onError) => {
  axios
    .post(`${baseUrl}/image`, formData, config)
    .then((response) => handleSuccess(response, onSuccess))
    .catch((error) => handleError(error, onError));
};
