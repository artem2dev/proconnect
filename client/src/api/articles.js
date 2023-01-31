import { useAxios } from './axiosConfig';

export const getArticle = async (postId) => useAxios.get(`articles/${postId}`);

export const getArticles = async () => useAxios.get(`articles/all`);
