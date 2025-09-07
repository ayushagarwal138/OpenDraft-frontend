import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import postService from '../../services/postService';
import commentService from '../../services/commentService';
import userService, { getFollowing, followUser, unfollowUser } from '../../services/userService';
import ReactionBar from '../../components/common/ReactionBar';
import { useToast } from '../../contexts/ToastContext';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Avatar,
  Divider,
  Paper,
  TextField,
  Card,
  CardContent
} from '@mui/material';
import {
  CalendarToday,
  Visibility,
  Favorite,
  FavoriteBorder,
  Comment,
  Share
} from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

const pickBaseUrl = (raw, fallback) => {
  const s = (raw || fallback || '').split(/[ ,]+/).filter(Boolean);
  return s[0] || fallback;
};
const BASE = pickBaseUrl(process.env.REACT_APP_API_URL, 'http://localhost:5001/api');

const PostDetail = () => {
  const { slug } = useParams();
  // eslint-disable-next-line no-unused-vars
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  // Add state for reply form
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const fetchPost = useCallback(async () => {
    try {
      const response = await postService.getPost(slug);
      setPost(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const fetchComments = useCallback(async (postId) => {
    if (!postId) return;
    try {
      const response = await commentService.getCommentsByPost(postId);
      setComments(response.data.data);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchPost();
  }, [slug, fetchPost]);

  useEffect(() => {
    if (post?._id) {
      fetchComments(post._id);
    }
  }, [post?._id, fetchComments]);

  // Fetch analytics
  useEffect(() => {
    if (post?._id) {
      const fetchAnalytics = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`${BASE}/posts/${post._id}/analytics`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAnalytics(res.data.analytics);
        } catch {}
      };
      fetchAnalytics();
    }
  }, [post?._id]);

  useEffect(() => {
    const checkFollowing = async () => {
      if (user?._id && post?.author?._id) {
        try {
          const res = await getFollowing(user._id);
          const ids = (res.data.following || []).map(u => u._id);
          setIsFollowingAuthor(ids.includes(post.author._id));
        } catch {}
      } else {
        setIsFollowingAuthor(false);
      }
    };
    checkFollowing();
  }, [user?._id, post?.author?._id]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      setError('Please login to like posts');
      return;
    }

    try {
      if (post.isLiked) {
        await postService.unlikePost(post._id);
        setPost(prev => ({
          ...prev,
          isLiked: false,
          likeCount: prev.likeCount - 1
        }));
      } else {
        await postService.likePost(post._id);
        setPost(prev => ({
          ...prev,
          isLiked: true,
          likeCount: prev.likeCount + 1
        }));
      }
    } catch (err) {
      setError('Failed to update like');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await commentService.createComment(post._id, {
        content: commentText,
      });
      
      setComments(prev => [response.data.data, ...prev]);
      setCommentText('');
    } catch (err) {
      setError('Failed to submit comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  // Reaction handlers for post
  const handlePostReact = async (emoji, add) => {
    if (!isAuthenticated) {
      setError('Please login to react to posts');
      return;
    }
    try {
      let response;
      if (add) {
        response = await postService.reactToPost(post._id, emoji);
      } else {
        response = await postService.unreactToPost(post._id, emoji);
      }
      setPost(prev => ({ ...prev, reactions: response.data.reactions }));
    } catch (err) {
      setError('Failed to update reaction');
    }
  };

  // Reaction handlers for comments
  const handleCommentReact = async (commentId, emoji, add) => {
    if (!isAuthenticated) {
      setError('Please login to react to comments');
      return;
    }
    try {
      let response;
      if (add) {
        response = await commentService.reactToComment(commentId, emoji);
      } else {
        response = await commentService.unreactToComment(commentId, emoji);
      }
      setComments(prev => prev.map(c => c._id === commentId ? { ...c, reactions: response.data.reactions } : c));
    } catch (err) {
      setError('Failed to update comment reaction');
    }
  };

  // Add reply submit handler
  const handleReplySubmit = async (parentCommentId) => {
    if (!replyText.trim()) return;
    try {
      const response = await commentService.createComment(post._id, {
        content: replyText,
        parentComment: parentCommentId,
      });
      setComments(prev => [response.data.data, ...prev]);
      setReplyText('');
      setReplyingTo(null);
    } catch (err) {
      setError('Failed to submit reply');
    }
  };

  const handleFollowAuthor = async () => {
    if (!user) return;
    setFollowLoading(true);
    try {
      await unfollowUser(post.author._id); // ensure idempotency in case of race? Keeping as follow
    } catch {}
    try {
      await followUser(post.author._id);
      setIsFollowingAuthor(true);
      showSuccess('You are now following this author');
    } catch (e) {
      showError('Failed to follow author');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUnfollowAuthor = async () => {
    if (!user) return;
    setFollowLoading(true);
    try {
      await unfollowUser(post.author._id);
      setIsFollowingAuthor(false);
      showSuccess('Unfollowed this author');
    } catch (e) {
      showError('Failed to unfollow author');
    } finally {
      setFollowLoading(false);
    }
  };

  const renderComments = (comments, parentId = null, level = 0) => {
    return comments
      .filter(comment => (comment.parentComment === parentId || (!comment.parentComment && !parentId)))
      .map(comment => (
        <Card key={comment._id} sx={{ mb: 2, ml: level * 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar
                src={comment.author?.avatar}
                alt={comment.author?.name}
                sx={{ width: 32, height: 32, mr: 1 }}
              />
              <Typography variant="subtitle2">
                {comment.author?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                {new Date(comment.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
            <Typography variant="body2">
              {comment.content}
            </Typography>
            {/* Comment Reactions */}
            <Box sx={{ mt: 1 }}>
              <ReactionBar
                type="comment"
                id={comment._id}
                reactions={comment.reactions || {}}
                onReact={(emoji, add) => handleCommentReact(comment._id, emoji, add)}
                userId={user?._id}
                disabled={!isAuthenticated}
              />
            </Box>
            {/* Reply Button and Form */}
            {isAuthenticated && (
              <Box sx={{ mt: 1 }}>
                <Button size="small" onClick={() => setReplyingTo(comment._id)}>
                  Reply
                </Button>
                {replyingTo === comment._id && (
                  <Box sx={{ mt: 1 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      sx={{ mb: 1 }}
                    />
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleReplySubmit(comment._id)}
                      disabled={!replyText.trim()}
                    >
                      Post Reply
                    </Button>
                    <Button size="small" onClick={() => setReplyingTo(null)} sx={{ ml: 1 }}>
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>
            )}
            {/* Render Replies Recursively */}
            {renderComments(comments, comment._id, level + 1)}
          </CardContent>
        </Card>
      ));
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

  if (error && !post) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" align="center">
          Post not found
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | OpenDraft</title>
        <meta name="description" content={post.excerpt || post.title} />
        {/* Open Graph tags */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        {post.featuredImage && (
          <meta property="og:image" content={post.featuredImage} />
        )}
        <meta property="og:site_name" content="OpenDraft" />
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || post.title} />
        {post.featuredImage && (
          <meta name="twitter:image" content={post.featuredImage} />
        )}
        {post.author?.name && (
          <meta name="author" content={post.author.name} />
        )}
        {/* JSON-LD Article */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt || post.title,
            image: post.featuredImage ? [post.featuredImage] : undefined,
            author: post.author?.name ? [{ '@type': 'Person', name: post.author.name }] : undefined,
            datePublished: post.publishedAt || post.createdAt,
            mainEntityOfPage: window.location.href,
          })}
        </script>
      </Helmet>
      <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Post Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {post.title}
        </Typography>
        
        {post.excerpt && (
          <Typography variant="h6" color="text.secondary" paragraph>
            {post.excerpt}
          </Typography>
        )}

        {/* Post Meta */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src={post.author?.avatar} alt={post.author?.name} />
            <Typography variant="body2">
              {post.author?.name}
            </Typography>
            {user && post.author?._id && user._id !== post.author._id && (
              isFollowingAuthor ? (
                <Button size="small" variant="outlined" color="secondary" onClick={handleUnfollowAuthor} disabled={followLoading}>
                  {followLoading ? '...' : 'Unfollow'}
                </Button>
              ) : (
                <Button size="small" variant="contained" color="primary" onClick={handleFollowAuthor} disabled={followLoading}>
                  {followLoading ? '...' : 'Follow'}
                </Button>
              )
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday sx={{ fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary">
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Visibility sx={{ fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary">
              {post.views} views
            </Typography>
          </Box>
        </Box>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <Box sx={{ mb: 3 }}>
            {post.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
        )}

        {/* Featured Image */}
        {post.featuredImage && (
          <Box sx={{ mb: 4 }}>
            <img
              src={post.featuredImage}
              alt={post.title}
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </Box>
        )}
        {/* Analytics Widget */}
        {analytics && (
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Visibility fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">{analytics.views} views</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Favorite fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">{analytics.likeCount} likes</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Comment fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">{analytics.commentCount} comments</Typography>
            </Box>
            {analytics.reactionCounts && Object.keys(analytics.reactionCounts).length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {Object.entries(analytics.reactionCounts).map(([emoji, count]) => (
                  <Chip key={emoji} label={`${emoji} ${count}`} size="small" />
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Post Content */}
      <Box sx={{ mb: 4 }}>
        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
          style={{
            lineHeight: 1.8,
            fontSize: '1.1rem'
          }}
        />
      </Box>
      {/* Post Reactions */}
      <Box sx={{ mb: 2 }}>
        <ReactionBar
          type="post"
          id={post._id}
          reactions={post.reactions || {}}
          onReact={handlePostReact}
          userId={user?._id}
          disabled={!isAuthenticated}
        />
      </Box>

      {/* Post Actions */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button
          variant={post.isLiked ? "contained" : "outlined"}
          startIcon={post.isLiked ? <Favorite /> : <FavoriteBorder />}
          onClick={handleLike}
          disabled={!isAuthenticated}
        >
          {post.likeCount || 0} Likes
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<Comment />}
        >
          {comments.length} Comments
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<Share />}
        >
          Share
        </Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Comments Section */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Comments ({comments.length})
        </Typography>

        {/* Add Comment */}
        {isAuthenticated && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <form onSubmit={handleCommentSubmit}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={submittingComment}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={submittingComment || !commentText.trim()}
              >
                {submittingComment ? <CircularProgress size={20} /> : 'Post Comment'}
              </Button>
            </form>
          </Paper>
        )}

        {/* Comments List */}
        <Box>
          {comments.length === 0 ? (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
              No comments yet. Be the first to comment!
            </Typography>
          ) : (
            renderComments(comments)
          )}
        </Box>
      </Box>
    </Container>
    </>
  );
};

export default PostDetail; 