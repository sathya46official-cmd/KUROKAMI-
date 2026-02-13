import API from './api';

export const getProfile = (id) => API.get(`/users/${id}`);
export const updateProfile = (data) => API.put('/users/profile', data);
export const updateAvatar = (avatar) => API.put('/users/avatar', { avatar });
export const deleteAccount = () => API.delete('/users/me');
