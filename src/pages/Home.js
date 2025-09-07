import React, { useState, useEffect, useCallback } from 'react';

import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Search, FilterList, Clear, Person, CalendarToday, Visibility, Favorite, TrendingUp, BookmarkBorder, Share } from '@mui/icons-material';
import { Grid, Card, Skeleton, CardContent, Box, Container, Fade, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, Alert, Grow, CardMedia, Chip, Pagination, IconButton, Tabs, Tab } from '@mui/material';import { Link as RouterLink } from 'react-router-dom';
import postService from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { followUser, unfollowUser, getFollowing } from '../services/userService';
import { useToast } from '../contexts/ToastContext';

const Home = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [feedTab, setFeedTab] = useState('all');
  const [followingIds, setFollowingIds] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [followingAuthors, setFollowingAuthors] = useState([]);
  const [followingLoading, setFollowingLoading] = useState({}); // authorId => bool
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const limit = 9;

  // Fetch following IDs for personalized feed
  useEffect(() => {
    if (feedTab === 'following' && user?._id) {
      getFollowing(user._id).then(res => {
        setFollowingIds(res.data.following.map(u => u._id));
      });
    }
  }, [feedTab, user]);

  // Fetch following authors for follow/unfollow buttons
  useEffect(() => {
    if (user?._id) {
      getFollowing(user._id).then(res => {
        setFollowingAuthors(res.data.following.map(u => u._id));
      });
    } else {
      setFollowingAuthors([]);
    }
  }, [user]);

  const handleFollow = async (authorId) => {
    if (!user) return;
    setFollowingLoading(prev => ({ ...prev, [authorId]: true }));
    try {
      await followUser(authorId);
      setFollowingAuthors(prev => [...prev, authorId]);
      showSuccess('Followed author');
    } catch (e) {
      showError('Failed to follow author');
    } finally {
      setFollowingLoading(prev => ({ ...prev, [authorId]: false }));
    }
  };
  const handleUnfollow = async (authorId) => {
    if (!user) return;
    setFollowingLoading(prev => ({ ...prev, [authorId]: true }));
    try {
      await unfollowUser(authorId);
      setFollowingAuthors(prev => prev.filter(id => id !== authorId));
      showSuccess('Unfollowed author');
    } catch (e) {
      showError('Failed to unfollow author');
    } finally {
      setFollowingLoading(prev => ({ ...prev, [authorId]: false }));
    }
  };

  // Fetch posts (all or following)
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      let params = { page, limit };
      if (feedTab === 'all') {
        if (search) params.search = search;
        if (category) params.category = category;
      } else if (feedTab === 'following' && followingIds.length > 0) {
        params.author = followingIds.join(',');
      }
      const response = await postService.getPosts(params);
      setPosts(response.data.data);
      setTotalPages(Math.ceil(response.data.total / limit));
      if (response.data.data.length > 0 && feedTab === 'all') {
        const uniqueCategories = [...new Set(response.data.data.map(post => post.category))];
        setCategories(uniqueCategories);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, [page, search, category, limit, feedTab, followingIds]);

  useEffect(() => {
    fetchPosts();
  }, [page, search, category, fetchPosts, feedTab, followingIds]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  const renderSkeleton = () => (
    <Grid container spacing={3}>
      {[...Array(6)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
              <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
              <Skeleton variant="text" height={16} sx={{ mb: 1 }} />
              <Skeleton variant="text" height={16} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Skeleton variant="rectangular" width={60} height={24} />
                <Skeleton variant="rectangular" width={60} height={24} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  if (loading && posts.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to OpenDraft
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Discover amazing stories and insights from our community
          </Typography>
        </Box>
        {renderSkeleton()}
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Feed Tabs */}
      <Tabs value={feedTab} onChange={(_, v) => setFeedTab(v)} centered sx={{ mb: 4 }}>
        <Tab label="All" value="all" />
        <Tab label="Following" value="following" disabled={!user} />
      </Tabs>
      {/* Hero Section */}
      <Fade in timeout={800}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          {/* Removed large Logo per request */}
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}
          >
            Welcome to OpenDraft
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            paragraph
            sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
          >
            Discover amazing stories and insights from our community of writers and creators
          </Typography>
          
          {/* Search and Filters */}
          <Box sx={{ 
            maxWidth: 800, 
            mx: 'auto',
            p: 3,
            backgroundColor: 'background.paper',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Search posts..."
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search by title, content, or tags..."
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    label="Category"
                    onChange={handleCategoryChange}
                    startAdornment={<FilterList sx={{ mr: 1, color: 'text.secondary' }} />}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={clearFilters}
                  startIcon={<Clear />}
                  disabled={!search && !category}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Fade>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Posts Grid */}
      <Box sx={{ mb: 4 }}>
        {posts.length === 0 && !loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No posts found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search criteria or check back later for new content.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {posts.map((post, index) => (
              <Grow in timeout={300 + index * 100} key={post._id}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                  >
                    {post.featuredImage && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={post.featuredImage}
                        alt={post.title}
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label={post.category}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                        <Typography
                          variant="h6"
                          component={RouterLink}
                          to={`/post/${post.slug}`}
                          sx={{
                            textDecoration: 'none',
                            color: 'text.primary',
                            fontWeight: 600,
                            lineHeight: 1.3,
                            mb: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            '&:hover': {
                              color: 'primary.main',
                            },
                          }}
                        >
                          {post.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.5,
                          }}
                        >
                          {post.excerpt || post.content.substring(0, 150)}...
                        </Typography>
                      </Box>

                      <Box sx={{ mt: 'auto' }}>
                        {/* Post Meta */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Person fontSize="small" color="action" />
                            <Typography
                              component={RouterLink}
                              to={post.author?._id ? `/profile/${post.author._id}` : '#'}
                              variant="caption"
                              color="text.secondary"
                              sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                            >
                              {post.author?.name || 'Anonymous'}
                            </Typography>
                            {user && post.author?._id && post.author._id !== user._id && (
                              followingAuthors.includes(post.author._id) ? (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="secondary"
                                  sx={{ ml: 1, textTransform: 'none' }}
                                  onClick={() => handleUnfollow(post.author._id)}
                                  disabled={!!followingLoading[post.author._id]}
                                >
                                  {followingLoading[post.author._id] ? '...' : 'Unfollow'}
                                </Button>
                              ) : (
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="primary"
                                  sx={{ ml: 1, textTransform: 'none' }}
                                  onClick={() => handleFollow(post.author._id)}
                                  disabled={!!followingLoading[post.author._id]}
                                >
                                  {followingLoading[post.author._id] ? '...' : 'Follow'}
                                </Button>
                              )
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarToday fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(post.createdAt)}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Stats */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Visibility fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {post.views || 0}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Favorite fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {post.likeCount || 0}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TrendingUp fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {getReadTime(post.content)} min read
                            </Typography>
                          </Box>
                        </Box>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
                            {post.tags.slice(0, 3).map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            ))}
                            {post.tags.length > 3 && (
                              <Chip
                                label={`+${post.tags.length - 3}`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            )}
                          </Box>
                        )}

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            component={RouterLink}
                            to={`/post/${post.slug}`}
                            variant="contained"
                            size="small"
                            fullWidth
                            sx={{ textTransform: 'none' }}
                          >
                            Read More
                          </Button>
                          <IconButton size="small" color="primary">
                            <BookmarkBorder />
                          </IconButton>
                          <IconButton size="small" color="primary">
                            <Share />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grow>
            ))}
          </Grid>
        )}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? "small" : "large"}
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Container>
  );
};

export default Home; 