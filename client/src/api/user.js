import { useAxios } from './axiosConfig';

export const getUser = async (params) => useAxios.get(params ? `users/profile/${params}` : 'users/profile');

export const getUsers = async () => useAxios.get('users/all');

export const updateUser = async (params) => useAxios.put('users/profile', params);
