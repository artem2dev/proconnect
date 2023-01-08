import { useAxios } from './axiosConfig';

export const getFriends = async () => useAxios.get('friends');

export const addToFriends = async (userId = '') => useAxios.post(`friends/add/${userId}`);

export const getFriendRequests = async () => useAxios.get('friends/requests');
