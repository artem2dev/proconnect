import { useAxios } from './axiosConfig';

export const getFriends = async (userName) => useAxios.get(`friends/${userName}`);

export const addToFriends = async (userId = '') => useAxios.post(`friends/add/${userId}`);

export const deleteFromFriends = async (userId = '') => useAxios.delete(`friends/delete/${userId}`);

export const acceptFriendRequest = async (friendRequestId = '') => useAxios.post(`friends/accept/${friendRequestId}`);

export const declineFriendRequest = async (friendRequestId = '') => useAxios.post(`friends/decline/${friendRequestId}`);

export const getFriendRequests = async () => useAxios.get('friends/requests');
