import { useAxios } from './axiosConfig';

export const uploadImage = async (formData) =>
  useAxios.post('media/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getImage = async () => useAxios.get('media/image');
