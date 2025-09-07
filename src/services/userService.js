import axios from 'axios';

const pickBaseUrl = (raw, fallback) => {
  const s = (raw || fallback || '').split(/[ ,]+/).filter(Boolean);
  return s[0] || fallback;
};

let API_URL = pickBaseUrl(process.env.REACT_APP_API_URL,'http://localhost:5001/api');
API_URL = API_URL.replace(/\/+$/, '').replace(/([^:]\/)\/+/, '$1');

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('token');

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get all users (Admin only)
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response;
};

// Get user by ID
export const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response;
};

// Update user (Admin only)
export const updateUser = async (userId, userData) => {
  const response = await api.put(`/users/${userId}`, userData);
  return response;
};

// Delete user (Admin only)
export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response;
};

// Update user role (Admin only)
export const updateUserRole = async (userId, role) => {
  const response = await api.put(`/users/${userId}/role`, { role });
  return response;
};

// Get user profile
export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response;
};

// Update user profile
export const updateProfile = async (profileData) => {
  const response = await api.put('/users/profile', profileData);
  return response;
};

// Change password
export const changePassword = async (passwordData) => {
  const response = await api.put('/users/change-password', passwordData);
  return response;
};

// Forgot password
export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response;
};

// Reset password
export const resetPassword = async (token, password) => {
  const response = await api.put('/auth/reset-password', { token, password });
  return response;
};

// Follow a user
export const followUser = async (userId) => {
  const response = await api.post(`/users/${userId}/follow`);
  return response;
};
// Unfollow a user
export const unfollowUser = async (userId) => {
  const response = await api.delete(`/users/${userId}/follow`);
  return response;
};
// Get followers
export const getFollowers = async (userId) => {
  const response = await api.get(`/users/${userId}/followers`);
  return response;
};
// Get following
export const getFollowing = async (userId) => {
  const response = await api.get(`/users/${userId}/following`);
  return response;
};

const userService = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
  getUserProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
};

export default userService; 