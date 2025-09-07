import axios from 'axios';

const pickBaseUrl = (raw, fallback) => {
  const s = (raw || fallback || '').split(/[ ,]+/).filter(Boolean);
  return s[0] || fallback;
};

let API_URL = pickBaseUrl(process.env.REACT_APP_API_URL,'http://localhost:5001/api');
API_URL = API_URL.replace(/\/+$/, '').replace(/([^:]\/)\/+/, '$1');

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const postService = {
  // Get all posts with optional filters
  getPosts: async (params = {}) => {
    const response = await api.get('/posts', { params });
    return response;
  },

  // Get single post by slug
  getPost: async (slug) => {
    const response = await api.get(`/posts/${slug}`);
    return response;
  },

  // Create new post
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response;
  },

  // Update post
  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response;
  },

  // Delete post
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response;
  },

  // Like post
  likePost: async (id) => {
    const response = await api.post(`/posts/${id}/like`);
    return response;
  },

  // Unlike post
  unlikePost: async (id) => {
    const response = await api.delete(`/posts/${id}/like`);
    return response;
  },

  // React to post (emoji)
  reactToPost: async (id, emoji) => {
    const response = await api.post(`/posts/${id}/reaction`, { emoji });
    return response;
  },
  // Remove reaction from post (emoji)
  unreactToPost: async (id, emoji) => {
    const response = await api.delete(`/posts/${id}/reaction`, { data: { emoji } });
    return response;
  },

  // Get user's posts
  getMyPosts: async (params = {}) => {
    const response = await api.get('/posts/me/posts', { params });
    return response;
  },

  // Get posts by author
  getPostsByAuthor: async (authorId, params = {}) => {
    const response = await api.get(`/posts/author/${authorId}`, { params });
    return response;
  },

  // Get all posts (Admin only)
  getAllPosts: async (params = {}) => {
    const response = await api.get('/posts/all', { params });
    return response;
  },

  // Upload image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },
};

export default postService; 