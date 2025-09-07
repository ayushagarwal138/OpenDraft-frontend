import React from 'react';

import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Grid, Card, Avatar, Chip } from '@mui/material';import {
  Article,
  Code,
  Security,
  Speed,
  People,
  TrendingUp,
  School,
  Support
} from '@mui/icons-material';
const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Article />,
      title: 'Rich Content Editor',
      description: 'Powerful WYSIWYG editor with advanced formatting options and media support.',
      color: 'primary'
    },
    {
      icon: <Code />,
      title: 'Developer Friendly',
      description: 'Built with modern technologies and clean APIs for easy customization.',
      color: 'secondary'
    },
    {
      icon: <Security />,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with JWT authentication and data encryption.',
      color: 'success'
    },
    {
      icon: <Speed />,
      title: 'Fast Performance',
      description: 'Optimized for speed with efficient database queries and caching.',
      color: 'warning'
    },
    {
      icon: <People />,
      title: 'Community Driven',
      description: 'Built for creators, writers, and developers to share knowledge.',
      color: 'info'
    },
    {
      icon: <TrendingUp />,
      title: 'Analytics & Insights',
      description: 'Comprehensive analytics to track your content performance.',
      color: 'error'
    }
  ];

  const team = [
    {
      name: 'Ayush Agarwal',
      role: 'Full Stack Developer',
      avatar: 'A',
      bio: 'Passionate about creating modern web applications with cutting-edge technologies.'
    },
    {
      name: 'OpenDraft Team',
      role: 'Development Team',
      avatar: 'O',
      bio: 'Dedicated to building the best content management platform for creators.'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '10K+' },
    { label: 'Published Posts', value: '50K+' },
    { label: 'Comments', value: '100K+' },
    { label: 'Countries', value: '25+' }
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
          About OpenDraft
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: 'auto', mb: 4, lineHeight: 1.6 }}
        >
          A modern content management platform designed for writers, creators, and developers. 
          Built with the MERN stack to provide a seamless publishing experience.
        </Typography>
        
        {/* Stats */}
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {stats.map((stat, index) => (
            <Grid xs={6} sm={3} key={index}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Mission Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Our Mission
        </Typography>
        <Grid container spacing={4} alignItems="center">
          <Grid xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="primary">
              Empowering Creators
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              OpenDraft was created with a simple mission: to provide writers, developers, and content creators 
              with a powerful yet simple platform to share their knowledge and stories with the world.
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              We believe that great content should be easy to create, beautiful to read, and simple to share. 
              That's why we've built OpenDraft using modern web technologies that ensure fast performance, 
              beautiful design, and seamless user experience.
            </Typography>
          </Grid>
          <Grid xs={12} md={6}>
            <Card sx={{ p: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
              <Typography variant="h6" gutterBottom>
                Why Choose OpenDraft?
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" sx={{ mb: 1 }}>
                  Modern, responsive design that works on all devices
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  Powerful rich text editor with media support
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  Built with React, Node.js, and MongoDB
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  Secure authentication and user management
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  Comprehensive analytics and insights
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Key Features
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid xs={12} sm={6} md={4} key={index}>
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
                    mb: 2,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Team Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Our Team
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {team.map((member, index) => (
            <Grid xs={12} sm={6} md={4} key={index}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 2,
                    backgroundColor: 'primary.main',
                    fontSize: '2rem',
                  }}
                >
                  {member.avatar}
                </Avatar>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {member.name}
                </Typography>
                <Chip
                  label={member.role}
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {member.bio}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Technology Stack */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Technology Stack
        </Typography>
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Frontend
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="React.js" color="primary" />
                <Chip label="Material-UI" color="secondary" />
                <Chip label="React Router" color="success" />
                <Chip label="Axios" color="warning" />
                <Chip label="React Hook Form" color="info" />
              </Box>
            </Card>
          </Grid>
          <Grid xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Backend
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="Node.js" color="primary" />
                <Chip label="Express.js" color="secondary" />
                <Chip label="MongoDB" color="success" />
                <Chip label="Mongoose" color="warning" />
                <Chip label="JWT" color="info" />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', p: 4, backgroundColor: 'primary.light', borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.contrastText' }}>
          Ready to Get Started?
        </Typography>
        <Typography variant="body1" sx={{ color: 'primary.contrastText', mb: 3 }}>
          Join thousands of creators who are already using OpenDraft to share their stories.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Chip
            icon={<School />}
            label="Learn More"
            color="primary"
            variant="outlined"
            sx={{ backgroundColor: 'white', cursor: 'pointer' }}
            onClick={() => navigate('/features')}
          />
          <Chip
            icon={<Support />}
            label="Get Support"
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

export default About; 