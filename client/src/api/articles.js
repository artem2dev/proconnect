import { useAxios } from './axiosConfig';

export const getArticle = async (postId) => useAxios.get(`articles/${postId}`);

export const getArticles = async () => useAxios.get(`articles/all`);

export const createArticle = async (FormData) => useAxios.post('articles', FormData);
export const deleteArticle = async (id) => useAxios.delete(`articles/${id}`);
export const likeArticle = async (id) => useAxios.post(`articles/like/${id}`, {});
export const dislikeArticle = async (id) => useAxios.post(`articles/dislike/${id}`, {});

export const commentArticle = async (comment, id) => useAxios.post(`articles/comment/${id}`, { comment });
export const deleteCommentArticle = async (commentId) => useAxios.delete(`articles/comment/${commentId}`);
