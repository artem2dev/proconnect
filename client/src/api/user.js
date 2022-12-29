import { useAxios } from './axiosConfig';

export const getUser = async () => useAxios.get('users/profile');

export const updateUser = async (params) => useAxios.put('users/profile', params);
