import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { People, Article, Comment, TrendingUp, Refresh, Edit, Delete, Dashboard } from '@mui/icons-material';
import { Container, Alert, Box, CircularProgress, Typography, Grid, Card, CardContent, Paper, Tabs, Tab, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, FormControl, Select, MenuItem, Chip, Tooltip, IconButton, Dialog, DialogTitle, DialogContent, TextField, InputLabel, DialogActions, Checkbox } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import postService from '../services/postService';
import commentService from '../services/commentService';
import axios from 'axios';
const pickBaseUrl = (raw, fallback) => {
  const s = (raw || fallback || '').split(/[ ,]+/).filter(Boolean);
  return s[0] || fallback;
};
const API_URL = pickBaseUrl(process.env.REACT_APP_API_URL, 'http://localhost:5001/api');

const AdminDashboard = () => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data states
  const [users, setUsers] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [posts, setPosts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [comments, setComments] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [reports, setReports] = useState([]);
  
  // Dialog states
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUserData, setEditUserData] = useState({});

  // UI states for search/filter/bulk
  const [userSearch, setUserSearch] = useState('');
  const [postSearch, setPostSearch] = useState('');
  const [commentSearch, setCommentSearch] = useState('');
  const [selectedPosts, setSelectedPosts] = useState({}); // id => bool
  const [selectedComments, setSelectedComments] = useState({});
  const [postStatusFilter, setPostStatusFilter] = useState('');
  const [commentStatusFilter, setCommentStatusFilter] = useState('');

  // Derived filtered datasets
  const filteredUsers = users.filter(u =>
    [u.name, u.email, u.role].join(' ').toLowerCase().includes(userSearch.toLowerCase())
  );
  const filteredPosts = posts.filter(p =>
    (postStatusFilter ? p.status === postStatusFilter : true) &&
    [p.title, p.author?.name, p.status].join(' ').toLowerCase().includes(postSearch.toLowerCase())
  );
  const filteredComments = comments.filter(c =>
    (commentStatusFilter ? c.status === commentStatusFilter : true) &&
    [c.content, c.author?.name, c.status].join(' ').toLowerCase().includes(commentSearch.toLowerCase())
  );

  // Bulk actions
  const handleBulkDeletePosts = async () => {
    if (!window.confirm('Delete selected posts?')) return;
    try {
      const token = localStorage.getItem('token');
      const ids = Object.keys(selectedPosts).filter(id => selectedPosts[id]);
      await Promise.all(ids.map(id => axios.delete(`${API_URL}/posts/${id}`, { headers: { Authorization: `Bearer ${token}` } })));
      setSelectedPosts({});
      fetchAdminData();
    } catch (e) {
      setError('Failed to bulk delete posts');
    }
  };
  const handleBulkApproveComments = async () => {
    try {
      const token = localStorage.getItem('token');
      const ids = Object.keys(selectedComments).filter(id => selectedComments[id]);
      await Promise.all(ids.map(id => axios.put(`${API_URL}/comments/${id}/moderate`, { status: 'approved' }, { headers: { Authorization: `Bearer ${token}` } })));
      setSelectedComments({});
      fetchAdminData();
    } catch (e) {
      setError('Failed to bulk approve comments');
    }
  };
  const handleBulkRejectComments = async () => {
    try {
      const token = localStorage.getItem('token');
      const ids = Object.keys(selectedComments).filter(id => selectedComments[id]);
      await Promise.all(ids.map(id => axios.put(`${API_URL}/comments/${id}/moderate`, { status: 'rejected' }, { headers: { Authorization: `Bearer ${token}` } })));
      setSelectedComments({});
      fetchAdminData();
    } catch (e) {
      setError('Failed to bulk reject comments');
    }
  };

  // Simple analytics chart data (last 7 days posts and comments)
  const dateKey = (d) => new Date(d).toISOString().slice(0, 10);
  const lastNDays = (n) => {
    const arr = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      arr.push(d.toISOString().slice(0, 10));
    }
    return arr;
  };
  const days = lastNDays(7);
  const postsByDay = days.map(day => posts.filter(p => dateKey(p.createdAt) === day).length);
  const commentsByDay = days.map(day => comments.filter(c => dateKey(c.createdAt) === day).length);
  const maxVal = Math.max(1, ...postsByDay, ...commentsByDay);

  const Bar = ({ value, color }) => (
    <Box sx={{ width: '100%', backgroundColor: 'action.hover', borderRadius: 1 }}>
      <Box sx={{ height: 10, width: `${(value / maxVal) * 100}%`, backgroundColor: color, borderRadius: 1 }} />
    </Box>
  );

  // Fetch reports
  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/reports`, { headers: { Authorization: `Bearer ${token}` } });
      setReports(res.data.data || []);
    } catch {}
  };

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersRes, postsRes, commentsRes] = await Promise.all([
        userService.getAllUsers(),
        postService.getAllPosts(),
        commentService.getAllComments()
      ]);

      const usersPayload = usersRes?.data?.users ?? usersRes?.data?.data ?? usersRes?.data ?? [];
      const postsPayload = postsRes?.data?.posts ?? postsRes?.data?.data ?? postsRes?.data ?? [];
      const commentsPayload = commentsRes?.data?.comments ?? commentsRes?.data?.data ?? commentsRes?.data ?? [];

      setUsers(Array.isArray(usersPayload) ? usersPayload : []);
      setPosts(Array.isArray(postsPayload) ? postsPayload : []);
      setComments(Array.isArray(commentsPayload) ? commentsPayload : []);
      fetchReports();
      
      // Calculate analytics
      const analyticsData = calculateAnalytics(
        Array.isArray(usersPayload) ? usersPayload : [],
        Array.isArray(postsPayload) ? postsPayload : [],
        Array.isArray(commentsPayload) ? commentsPayload : []
      );
      setAnalytics(analyticsData);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch admin data
  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const calculateAnalytics = (users, posts, comments) => {
    const totalUsers = users.length;
    const totalPosts = posts.length;
    const totalComments = comments.length;
    const activeUsers = users.filter(u => u.lastLogin > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
    const publishedPosts = posts.filter(p => p.status === 'published').length;
    const draftPosts = posts.filter(p => p.status === 'draft').length;
    const pendingComments = comments.filter(c => c.status === 'pending').length;

    return {
      totalUsers,
      totalPosts,
      totalComments,
      activeUsers,
      publishedPosts,
      draftPosts,
      pendingComments,
      engagementRate: totalPosts > 0 ? ((totalComments + totalPosts) / totalUsers * 100).toFixed(2) : 0
    };
  };

  const handleUserEdit = (user) => {
    setSelectedUser(user);
    setEditUserData({
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified
    });
    setUserDialogOpen(true);
  };

  const handleUserUpdate = async () => {
    try {
      await userService.updateUser(selectedUser._id, editUserData);
      setUserDialogOpen(false);
      fetchAdminData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleUserDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(userId);
        fetchAdminData();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userService.updateUserRole(userId, newRole);
      fetchAdminData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update user role');
    }
  };

  // Moderation actions for reports
  const handleReportStatus = async (reportId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/reports/${reportId}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchReports();
    } catch {}
  };
  const handleReportDelete = async (reportId) => {
    if (window.confirm('Delete this report?')) {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/reports/${reportId}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchReports();
    }
  };

  // Moderation actions for posts
  const handlePostStatus = async (postId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/posts/${postId}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchAdminData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update post status');
    }
  };
  const handlePostDelete = async (postId) => {
    if (window.confirm('Delete this post?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/posts/${postId}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchAdminData();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete post');
      }
    }
  };
  // Moderation actions for comments
  const handleCommentStatus = async (commentId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/comments/${commentId}/moderate`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchAdminData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update comment status');
    }
  };
  const handleCommentDelete = async (commentId) => {
    if (window.confirm('Delete this comment?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/comments/${commentId}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchAdminData();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete comment');
      }
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Access denied. Admin privileges required.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage users, content, and monitor site analytics
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Analytics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h4">
                    {analytics.totalUsers}
                  </Typography>
                </Box>
                <People color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Posts
                  </Typography>
                  <Typography variant="h4">
                    {analytics.totalPosts}
                  </Typography>
                </Box>
                <Article color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Comments
                  </Typography>
                  <Typography variant="h4">
                    {analytics.totalComments}
                  </Typography>
                </Box>
                <Comment color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Engagement Rate
                  </Typography>
                  <Typography variant="h4">
                    {analytics.engagementRate}%
                  </Typography>
                </Box>
                <TrendingUp color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Admin Navigation Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Site Overview" />
          <Tab label="User Management" />
          <Tab label="Content Moderation" />
          <Tab label="Site Analytics" />
          <Tab label="Reports & Issues" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Paper>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Site Overview</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" startIcon={<Refresh />} onClick={fetchAdminData}>Refresh</Button>
            </Box>
          </Box>
          <Box sx={{ p: 3 }}>
            <Typography variant="body1" color="text.secondary" paragraph>
              Welcome to the admin dashboard. Here you can monitor site activity, manage users, moderate content, and view analytics.
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                    <Typography variant="body2" color="text.secondary">
                      • {analytics.totalUsers || 0} total users registered
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • {analytics.totalPosts || 0} posts published
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • {analytics.totalComments || 0} comments made
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => setActiveTab(1)}
                      >
                        Manage Users
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => setActiveTab(2)}
                      >
                        Moderate Content
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => setActiveTab(3)}
                      >
                        View Analytics
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">User Management</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField size="small" placeholder="Search users..." value={userSearch} onChange={e => setUserSearch(e.target.value)} />
              <Button variant="outlined" startIcon={<Refresh />} onClick={fetchAdminData}>Refresh</Button>
            </Box>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <FormControl size="small">
                        <Select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                     disabled={user._id === currentUser?._id}
                        >
                          <MenuItem value="reader">Reader</MenuItem>
                          <MenuItem value="author">Author</MenuItem>
                          <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.isVerified ? 'Verified' : 'Unverified'}
                        color={user.isVerified ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(user.lastLogin).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit User">
                          <IconButton size="small" onClick={() => handleUserEdit(user)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <span>
                            <IconButton size="small" color="error" onClick={() => handleUserDelete(user._id)} disabled={user._id === currentUser?._id}>
                              <Delete />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>Content Moderation</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField size="small" placeholder="Search posts..." value={postSearch} onChange={e => setPostSearch(e.target.value)} />
              <FormControl size="small">
                <InputLabel>Status</InputLabel>
                <Select label="Status" value={postStatusFilter} onChange={e => setPostStatusFilter(e.target.value)} sx={{ minWidth: 140 }}>
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </Select>
              </FormControl>
              <Button variant="outlined" startIcon={<Refresh />} onClick={fetchAdminData}>Refresh</Button>
              <Button variant="contained" color="error" onClick={handleBulkDeletePosts} disabled={Object.values(selectedPosts).every(v => !v)}>Delete Selected</Button>
            </Box>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Checkbox indeterminate={false} checked={filteredPosts.every(p => selectedPosts[p._id]) && filteredPosts.length > 0} onChange={e => {
                    const checked = e.target.checked;
                    const next = { ...selectedPosts };
                    filteredPosts.forEach(p => next[p._id] = checked);
                    setSelectedPosts(next);
                  }} /></TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell><Checkbox checked={!!selectedPosts[post._id]} onChange={e => setSelectedPosts(prev => ({ ...prev, [post._id]: e.target.checked }))} /></TableCell>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>{post.author?.name}</TableCell>
                    <TableCell>
                      <FormControl size="small">
                        <Select value={post.status} onChange={e => handlePostStatus(post._id, e.target.value)}>
                          <MenuItem value="published">Published</MenuItem>
                          <MenuItem value="draft">Draft</MenuItem>
                          <MenuItem value="archived">Archived</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Tooltip title="Delete Post">
                        <IconButton size="small" color="error" onClick={() => handlePostDelete(post._id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {activeTab === 3 && (
        <Paper>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>Comment Moderation</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField size="small" placeholder="Search comments..." value={commentSearch} onChange={e => setCommentSearch(e.target.value)} />
              <FormControl size="small">
                <InputLabel>Status</InputLabel>
                <Select label="Status" value={commentStatusFilter} onChange={e => setCommentStatusFilter(e.target.value)} sx={{ minWidth: 140 }}>
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
              <Button variant="outlined" startIcon={<Refresh />} onClick={fetchAdminData}>Refresh</Button>
              <Button variant="contained" onClick={handleBulkApproveComments} disabled={Object.values(selectedComments).every(v => !v)}>Approve Selected</Button>
              <Button variant="contained" color="warning" onClick={handleBulkRejectComments} disabled={Object.values(selectedComments).every(v => !v)}>Reject Selected</Button>
            </Box>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Checkbox indeterminate={false} checked={filteredComments.every(c => selectedComments[c._id]) && filteredComments.length > 0} onChange={e => {
                    const checked = e.target.checked;
                    const next = { ...selectedComments };
                    filteredComments.forEach(c => next[c._id] = checked);
                    setSelectedComments(next);
                  }} /></TableCell>
                  <TableCell>Content</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredComments.map((comment) => (
                  <TableRow key={comment._id}>
                    <TableCell><Checkbox checked={!!selectedComments[comment._id]} onChange={e => setSelectedComments(prev => ({ ...prev, [comment._id]: e.target.checked }))} /></TableCell>
                    <TableCell>{comment.content}</TableCell>
                    <TableCell>{comment.author?.name}</TableCell>
                    <TableCell>
                      <FormControl size="small">
                        <Select value={comment.status} onChange={e => handleCommentStatus(comment._id, e.target.value)}>
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="approved">Approved</MenuItem>
                          <MenuItem value="rejected">Rejected</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>{new Date(comment.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Tooltip title="Delete Comment">
                        <IconButton size="small" color="error" onClick={() => handleCommentDelete(comment._id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {activeTab === 4 && (
        <Paper>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Site Analytics</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>Posts (last 7 days)</Typography>
                    {days.map((day, idx) => (
                      <Box key={day} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="caption" sx={{ width: 80 }}>{day.slice(5)}</Typography>
                        <Bar value={postsByDay[idx]} color={'primary.main'} />
                        <Typography variant="caption" sx={{ width: 24, textAlign: 'right' }}>{postsByDay[idx]}</Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>Comments (last 7 days)</Typography>
                    {days.map((day, idx) => (
                      <Box key={day} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="caption" sx={{ width: 80 }}>{day.slice(5)}</Typography>
                        <Bar value={commentsByDay[idx]} color={'secondary.main'} />
                        <Typography variant="caption" sx={{ width: 24, textAlign: 'right' }}>{commentsByDay[idx]}</Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}

      {activeTab === 5 && (
        <Paper>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Reports & Issues</Typography>
            <Button variant="outlined" startIcon={<Refresh />} onClick={fetchReports}>Refresh</Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reporter</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Target ID</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report._id}>
                    <TableCell>{report.reporter?.name}</TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{report.targetId}</TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell>
                      <FormControl size="small">
                        <Select
                          value={report.status}
                          onChange={e => handleReportStatus(report._id, e.target.value)}
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="reviewed">Reviewed</MenuItem>
                          <MenuItem value="resolved">Resolved</MenuItem>
                          <MenuItem value="rejected">Rejected</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Tooltip title="Delete Report">
                        <IconButton size="small" color="error" onClick={() => handleReportDelete(report._id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Edit User Dialog */}
      <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={editUserData.name || ''}
              onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              value={editUserData.email || ''}
              onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={editUserData.role || 'reader'}
                onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value })}
                label="Role"
              >
                <MenuItem value="reader">Reader</MenuItem>
                <MenuItem value="author">Author</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUserUpdate} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 