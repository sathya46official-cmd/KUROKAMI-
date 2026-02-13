import API from './api';

export const getPosts = (page = 1) => API.get(`/posts?page=${page}`);
export const createPost = (data) => API.post('/posts', data);
export const likePost = (id) => API.post(`/posts/${id}/like`);
export const getUserPosts = (userId) => API.get(`/posts/user/${userId}`);
export const deletePost = (id) => API.delete(`/posts/${id}`);
