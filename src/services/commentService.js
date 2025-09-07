import axios from 'axios';

const pickBaseUrl = (raw, fallback) => {
  const s = (raw || fallback || '').split(/[ ,]+/).filter(Boolean);
  return s[0] || fallback;
};

let API_URL = pickBaseUrl(process.env.REACT_APP_API_URL,'http://localhost:5001/api');
API_URL = API_URL.replace(/\/+$/, '').replace(/([^:]\/)\/+/, '$1');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const commentService = {
  getCommentsByPost: async (postId) => {
    const response = await api.get(`/comments/post/${postId}`);
    return response;
  },
  createComment: async (postId, data) => {
    const response = await api.post(`/comments/${postId}`, data);
    return response;
  },
  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response;
  },
  addReactionToComment: async (commentId, emoji) => {
    const response = await api.post(`/comments/${commentId}/reaction`, { emoji });
    return response;
  },
  removeReactionFromComment: async (commentId, emoji) => {
    const response = await api.delete(`/comments/${commentId}/reaction`, { data: { emoji } });
    return response;
  },
  getAllComments: async (params = {}) => {
    const response = await api.get('/comments/all', { params });
    return response;
  },
};

export default commentService;