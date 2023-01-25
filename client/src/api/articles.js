import { useAxios } from './axiosConfig';

export const getArticle = async (postId) => useAxios.get(`articles/${postId}`);
