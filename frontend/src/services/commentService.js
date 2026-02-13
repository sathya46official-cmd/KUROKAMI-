import API from './api';

export const getComments = (postId) => API.get(`/posts/${postId}/comments`);
export const addComment = (postId, text) => API.post(`/posts/${postId}/comments`, { text });
export const deleteComment = (commentId) => API.delete(`/comments/${commentId}`);
