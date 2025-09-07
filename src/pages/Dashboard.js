import React, { useState, useEffect, useCallback } from 'react';

import { Link as RouterLink } from 'react-router-dom';
import { Refresh, Add, Sort, Visibility, Edit, Delete, AdminPanelSettings } from '@mui/icons-material';
import { Container, Box, CircularProgress, Typography, Alert, Grid, Paper, Button, Tabs, Tab, LinearProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';import { useAuth } from '../context/AuthContext';
import postService from '../services/postService';
// eslint-disable-next-line no-unused-vars
import AnalyticsWidget from '../components/dashboard/AnalyticsWidget';
import AdvancedSearch from '../components/common/AdvancedSearch';
import EnhancedAnalytics from '../components/dashboard/EnhancedAnalytics';

const Dashboard = () => {
  const { user } = useAuth();
  
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filterAndSortPosts = useCallback(() => {
    let filtered = [...posts];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(post => post.status === selectedStatus);
    }

    // Sort posts
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredPosts(filtered);
  }, [posts, searchQuery, sortBy, sortOrder, selectedStatus]);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  useEffect(() => {
    filterAndSortPosts();
  }, [filterAndSortPosts]);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getMyPosts();
      setPosts(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await postService.deletePost(postToDelete._id);
      setPosts(posts.filter(post => post._id !== postToDelete._id));
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'error';
      default:
        return 'default';
    }
  };

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h4" component="h1">
            My Dashboard
          </Typography>
          {user?.role === 'admin' && (
            <>
              <Typography variant="body2" color="text.secondary">→</Typography>
              <Button
                component={RouterLink}
                to="/admin"
                variant="outlined"
                size="small"
                startIcon={<AdminPanelSettings />}
              >
                Admin Dashboard
              </Button>
            </>
          )}
        </Box>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {user?.name}! Manage your posts and account here.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Enhanced Analytics Dashboard */}
      <EnhancedAnalytics posts={posts} />

      {/* Enhanced Posts Management */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            {/* Header with Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                My Posts ({filteredPosts.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={fetchMyPosts}
                  disabled={loading}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  component={RouterLink}
                  to="/create-post"
                >
                  Create New Post
                </Button>
              </Box>
            </Box>

            {/* Search and Filters */}
            <Box sx={{ mb: 3 }}>
              <AdvancedSearch
                onSearch={(query) => setSearchQuery(query)}
                placeholder="Search posts by title, content, or category..."
                showFilters={false}
              />
            </Box>

            {/* Status Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => {
                  setActiveTab(newValue);
                  if (newValue === 0) setSelectedStatus('all');
                  else if (newValue === 1) setSelectedStatus('published');
                  else if (newValue === 2) setSelectedStatus('draft');
                }}
              >
                <Tab label={`All (${posts.length})`} />
                <Tab label={`Published (${posts.filter(p => p.status === 'published').length})`} />
                <Tab label={`Drafts (${posts.filter(p => p.status === 'draft').length})`} />
              </Tabs>
            </Box>

            {/* Sort Controls */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Sort by:
              </Typography>
              <Button
                size="small"
                variant={sortBy === 'createdAt' ? 'contained' : 'outlined'}
                onClick={() => {
                  setSortBy('createdAt');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}
                startIcon={<Sort />}
              >
                Date {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Button>
              <Button
                size="small"
                variant={sortBy === 'title' ? 'contained' : 'outlined'}
                onClick={() => {
                  setSortBy('title');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}
                startIcon={<Sort />}
              >
                Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Button>
              <Button
                size="small"
                variant={sortBy === 'views' ? 'contained' : 'outlined'}
                onClick={() => {
                  setSortBy('views');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}
                startIcon={<Sort />}
              >
                Views {sortBy === 'views' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Button>
            </Box>

            {/* Loading Progress */}
            {loading && <LinearProgress sx={{ mb: 2 }} />}

            {/* Posts Table */}
            <TableContainer>
              <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Views</TableCell>
                  <TableCell>Likes</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                        {posts.length === 0 
                          ? 'No posts yet. Create your first post to get started!'
                          : 'No posts match your search criteria.'
                        }
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPosts.map((post) => (
                    <TableRow key={post._id}>
                      <TableCell>
                        <Typography variant="subtitle2" noWrap>
                          {post.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={post.status}
                          color={getStatusColor(post.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{post.category}</TableCell>
                      <TableCell>{post.views}</TableCell>
                      <TableCell>{post.likeCount || 0}</TableCell>
                      <TableCell>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            component={RouterLink}
                            to={`/posts/${post.slug}`}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            size="small"
                            component={RouterLink}
                            to={`/edit-post/${post._id}`}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(post)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      </Grid>

    {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{postToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 