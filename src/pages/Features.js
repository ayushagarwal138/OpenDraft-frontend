import React from 'react';

import { Article, Dashboard, Security, Devices, Edit, FilterList, Bookmark, Cloud, TrendingUp, Person, Comment, Share, Search, Notifications, Code, Brush, AutoAwesome, School, Settings, CheckCircle, Help, Email, Chat } from '@mui/icons-material';
import { Container, Box, Typography, Grid, Card, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material';import { useNavigate } from 'react-router-dom';
const Features = () => {
  const navigate = useNavigate();

  const mainFeatures = [
    {
      icon: <Article />,
      title: 'Rich Content Editor',
      description: 'Powerful WYSIWYG editor with advanced formatting, media support, and real-time collaboration.',
      features: [
        'Advanced text formatting and styling',
        'Image and video embedding',
        'Code syntax highlighting',
        'Table creation and management',
        'Link and media management',
        'Auto-save functionality'
      ],
      color: 'primary'
    },
    {
      icon: <Dashboard />,
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics to track your content performance and audience engagement.',
      features: [
        'Real-time view statistics',
        'Engagement metrics',
        'Popular content insights',
        'Audience demographics',
        'Performance trends',
        'Export capabilities'
      ],
      color: 'success'
    },
    {
      icon: <Security />,
      title: 'Security & Authentication',
      description: 'Enterprise-grade security with JWT authentication and role-based access control.',
      features: [
        'JWT token authentication',
        'Role-based permissions',
        'Password encryption',
        'Session management',
        'API rate limiting',
        'Data validation'
      ],
      color: 'error'
    },
    {
      icon: <Devices />,
      title: 'Responsive Design',
      description: 'Fully responsive design that works perfectly on desktop, tablet, and mobile devices.',
      features: [
        'Mobile-first approach',
        'Touch-friendly interface',
        'Cross-browser compatibility',
        'Progressive Web App features',
        'Offline capabilities',
        'Fast loading times'
      ],
      color: 'warning'
    }
  ];

  const additionalFeatures = [
    {
      category: 'Content Management',
      features: [
        { name: 'Post Creation & Editing', icon: <Edit /> },
        { name: 'Draft Management', icon: <Article /> },
        { name: 'Category Organization', icon: <FilterList /> },
        { name: 'Tag System', icon: <Bookmark /> },
        { name: 'Media Library', icon: <Cloud /> },
        { name: 'SEO Optimization', icon: <TrendingUp /> }
      ]
    },
    {
      category: 'User Experience',
      features: [
        { name: 'User Profiles', icon: <Person /> },
        { name: 'Comment System', icon: <Comment /> },
        { name: 'Like & Share', icon: <Share /> },
        { name: 'Search & Filter', icon: <Search /> },
        { name: 'Notifications', icon: <Notifications /> },
        { name: 'Bookmarking', icon: <Bookmark /> }
      ]
    },
    {
      category: 'Developer Features',
      features: [
        { name: 'RESTful API', icon: <Code /> },
        { name: 'Custom Themes', icon: <Brush /> },
        { name: 'Plugin System', icon: <AutoAwesome /> },
        { name: 'Webhooks', icon: <Cloud /> },
        { name: 'API Documentation', icon: <School /> },
        { name: 'Developer Tools', icon: <Settings /> }
      ]
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      features: [
        'Up to 10 posts',
        'Basic analytics',
        'Community support',
        'Standard themes'
      ],
      color: 'primary'
    },
    {
      name: 'Pro',
      price: '$9',
      period: '/month',
      features: [
        'Unlimited posts',
        'Advanced analytics',
        'Priority support',
        'Custom themes',
        'API access',
        'Team collaboration'
      ],
      color: 'success',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$29',
      period: '/month',
      features: [
        'Everything in Pro',
        'White-label solution',
        'Dedicated support',
        'Custom integrations',
        'Advanced security',
        'SLA guarantee'
      ],
      color: 'error'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
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
          Features
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: 'auto', mb: 4, lineHeight: 1.6 }}
        >
          Discover all the powerful features that make OpenDraft the perfect platform 
          for content creators, writers, and developers.
        </Typography>
      </Box>

      {/* Main Features */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Core Features
        </Typography>
        <Grid container spacing={4}>
          {mainFeatures.map((feature, index) => (
            <Grid xs={12} md={6} key={index}>
              <Card sx={{ height: '100%', p: 3 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 2,
                    backgroundColor: `${feature.color}.light`,
                    color: `${feature.color}.main`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                  {feature.description}
                </Typography>
                <List dense>
                  {feature.features.map((item, idx) => (
                    <ListItem key={idx} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Additional Features */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Additional Features
        </Typography>
        <Grid container spacing={4}>
          {additionalFeatures.map((category, index) => (
            <Grid xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', p: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  {category.category}
                </Typography>
                <List dense>
                  {category.features.map((feature, idx) => (
                    <ListItem key={idx} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        {feature.icon}
                      </ListItemIcon>
                      <ListItemText primary={feature.name} />
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Pricing Plans */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Pricing Plans
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {pricingPlans.map((plan, index) => (
            <Grid xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  p: 3,
                  position: 'relative',
                  border: plan.popular ? '2px solid' : '1px solid',
                  borderColor: plan.popular ? 'primary.main' : 'divider',
                  transform: plan.popular ? 'scale(1.05)' : 'none',
                }}
              >
                {plan.popular && (
                  <Chip
                    label="Most Popular"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  />
                )}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                    {plan.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', mb: 2 }}>
                    <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                      {plan.price}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {plan.period}
                    </Typography>
                  </Box>
                </Box>
                <List dense>
                  {plan.features.map((feature, idx) => (
                    <ListItem key={idx} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Chip
                    label="Get Started"
                    color={plan.color}
                    variant="contained"
                    sx={{ px: 3, py: 1, cursor: 'pointer' }}
                    onClick={() => navigate('/register')}
                  />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Technology Stack */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Built with Modern Technologies
        </Typography>
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Frontend Technologies
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="React.js" color="primary" />
                <Chip label="Material-UI" color="secondary" />
                <Chip label="React Router" color="success" />
                <Chip label="Axios" color="warning" />
                <Chip label="React Hook Form" color="info" />
                <Chip label="React Quill" color="error" />
              </Box>
            </Card>
          </Grid>
          <Grid xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Backend Technologies
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="Node.js" color="primary" />
                <Chip label="Express.js" color="secondary" />
                <Chip label="MongoDB" color="success" />
                <Chip label="Mongoose" color="warning" />
                <Chip label="JWT" color="info" />
                <Chip label="bcryptjs" color="error" />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', p: 4, backgroundColor: 'primary.light', borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.contrastText' }}>
          Ready to Experience OpenDraft?
        </Typography>
        <Typography variant="body1" sx={{ color: 'primary.contrastText', mb: 3 }}>
          Start creating, publishing, and sharing your content with the world today.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Chip
            icon={<Help />}
            label="Get Help"
            color="primary"
            variant="outlined"
            sx={{ backgroundColor: 'white', cursor: 'pointer' }}
            onClick={() => navigate('/contact')}
          />
          <Chip
            icon={<Email />}
            label="Contact Us"
            color="primary"
            variant="outlined"
            sx={{ backgroundColor: 'white', cursor: 'pointer' }}
            onClick={() => navigate('/contact')}
          />
          <Chip
            icon={<Chat />}
            label="Live Chat"
            color="primary"
            variant="outlined"
            sx={{ backgroundColor: 'white', cursor: 'pointer' }}
            onClick={() => navigate('/contact')}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Features; 