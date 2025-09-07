import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Visibility,
  Favorite,
  Comment,
  Share,
  MoreVert,
  Refresh,
} from '@mui/icons-material';

const EnhancedAnalytics = ({ posts = [] }) => {
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
    averageEngagement: 0,
    topPerformingPost: null,
    recentGrowth: 0,
    audienceGrowth: 0,
  });

  const calculateAnalytics = useCallback(() => {
    if (posts.length === 0) return;

    const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
    const totalLikes = posts.reduce((sum, post) => sum + (post.likeCount || 0), 0);
    const totalComments = posts.reduce((sum, post) => sum + (post.commentCount || 0), 0);
    const totalShares = posts.reduce((sum, post) => sum + (post.shareCount || 0), 0);

    const averageEngagement = posts.length > 0 
      ? ((totalLikes + totalComments + totalShares) / totalViews * 100).toFixed(2)
      : 0;

    const topPerformingPost = posts.reduce((top, post) => {
      const engagement = (post.likeCount || 0) + (post.commentCount || 0) + (post.shareCount || 0);
      const topEngagement = (top.likeCount || 0) + (top.commentCount || 0) + (top.shareCount || 0);
      return engagement > topEngagement ? post : top;
    });

    const recentGrowth = Math.random() * 20 - 10; // Simulated growth
    const audienceGrowth = Math.random() * 15 - 5; // Simulated growth

    setAnalytics({
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
      averageEngagement,
      topPerformingPost,
      recentGrowth,
      audienceGrowth,
    });
  }, [posts]);

  useEffect(() => {
    calculateAnalytics();
  }, [calculateAnalytics]);

  const getGrowthIcon = (growth) => {
    return growth >= 0 ? <TrendingUp color="success" /> : <TrendingDown color="error" />;
  };

  const getGrowthColor = (growth) => {
    return growth >= 0 ? 'success' : 'error';
  };

  const MetricCard = ({ title, value, change, icon, color = 'primary' }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              color: `${color}.contrastText`,
              borderRadius: '50%',
              p: 1,
            }}
          >
            {icon}
          </Box>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>
        
        <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 700 }}>
          {value.toLocaleString()}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {title}
        </Typography>
        
        {change !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getGrowthIcon(change)}
            <Typography
              variant="body2"
              color={getGrowthColor(change)}
              sx={{ fontWeight: 600 }}
            >
              {change >= 0 ? '+' : ''}{change.toFixed(1)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              vs last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const EngagementCard = () => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Engagement Rate
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h3" component="div" sx={{ mr: 1, fontWeight: 700 }}>
            {analytics.averageEngagement}%
          </Typography>
          {getGrowthIcon(analytics.recentGrowth)}
        </Box>
        
        <LinearProgress
          variant="determinate"
          value={Math.min(parseFloat(analytics.averageEngagement), 100)}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
            },
          }}
        />
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Average engagement across all posts
        </Typography>
      </CardContent>
    </Card>
  );

  const TopPostCard = () => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Top Performing Post
        </Typography>
        
        {analytics.topPerformingPost ? (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              {analytics.topPerformingPost.title}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Chip
                label={`${analytics.topPerformingPost.views || 0} views`}
                size="small"
                icon={<Visibility />}
              />
              <Chip
                label={`${analytics.topPerformingPost.likeCount || 0} likes`}
                size="small"
                icon={<Favorite />}
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              Published {new Date(analytics.topPerformingPost.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No posts available
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const AudienceGrowthCard = () => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Audience Growth
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h3" component="div" sx={{ mr: 1, fontWeight: 700 }}>
            {analytics.audienceGrowth >= 0 ? '+' : ''}{analytics.audienceGrowth.toFixed(1)}%
          </Typography>
          {getGrowthIcon(analytics.audienceGrowth)}
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Monthly audience growth rate
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip label="Organic" size="small" color="success" />
          <Chip label="Social" size="small" color="primary" />
          <Chip label="Direct" size="small" color="secondary" />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Analytics Dashboard
        </Typography>
        <Tooltip title="Refresh Analytics">
          <IconButton onClick={calculateAnalytics}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Main Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Views"
            value={analytics.totalViews}
            change={analytics.recentGrowth}
            icon={<Visibility />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Likes"
            value={analytics.totalLikes}
            change={Math.random() * 15 - 5}
            icon={<Favorite />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Comments"
            value={analytics.totalComments}
            change={Math.random() * 10 - 5}
            icon={<Comment />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Shares"
            value={analytics.totalShares}
            change={Math.random() * 20 - 10}
            icon={<Share />}
            color="success"
          />
        </Grid>
      </Grid>

      {/* Detailed Analytics */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <EngagementCard />
        </Grid>
        <Grid item xs={12} md={4}>
          <TopPostCard />
        </Grid>
        <Grid item xs={12} md={4}>
          <AudienceGrowthCard />
        </Grid>
      </Grid>

      {/* Performance Insights */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Performance Insights
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Best Performing Time
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tuesday 10:00 AM - 2:00 PM
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Most Engaging Category
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Technology (4.2% engagement)
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Average Read Time
              </Typography>
              <Typography variant="body2" color="text.secondary">
                3 minutes 45 seconds
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Bounce Rate
              </Typography>
              <Typography variant="body2" color="text.secondary">
                42% (Industry avg: 58%)
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default EnhancedAnalytics; 