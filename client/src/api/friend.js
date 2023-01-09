import { useAxios } from './axiosConfig';

export const getFriends = async () => useAxios.get('friends');

export const addToFriends = async (userId = '') => useAxios.post(`friends/add/${userId}`);

export const acceptFriendRequest = async (friendRequestId = '') => useAxios.post(`friends/accept/${friendRequestId}`);

export const declineFriendRequest = async (friendRequestId = '') => useAxios.post(`friends/decline/${friendRequestId}`);

export const getFriendRequests = async () => useAxios.get('friends/requests');
