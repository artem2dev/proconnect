import { useAxios } from './axiosConfig';

export const getMessages = async (userName) => useAxios.get(`messages/${userName}`);
