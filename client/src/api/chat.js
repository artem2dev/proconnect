import { useAxios } from './axiosConfig';

export const getMessages = async (userId) => useAxios.get(`messages/${userId}`);

export const getChats = async () => useAxios.get(`messages/chats`);
