import { useAxios } from './axiosConfig';

export const changePassword = async (params) => useAxios.post(`auth/reset-password`, params);

export const registerUser = async (params) => useAxios.post(`auth/registration`, params, { withCredentials: true });

export const loginUser = async (params) => useAxios.post(`auth/login`, params, { withCredentials: true });

export const refreshTokens = async () => useAxios.get(`auth/refresh`, { withCredentials: true });

export const signOut = async () => useAxios.get(`auth/sign-out`, { withCredentials: true });
