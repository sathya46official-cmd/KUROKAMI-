import API from './api';

export const searchUsers = (query) => API.get(`/explore/users?q=${query}`);
export const getAllUsers = () => API.get('/explore/users');
export const getTrendingPosts = () => API.get('/explore/trending');
