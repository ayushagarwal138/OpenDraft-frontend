import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  GitHub,
  Twitter,
  LinkedIn,
  Email,
  Article,
  Code,
  Security,
  Speed
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { text: 'About OpenDraft', path: '/about' },
        { text: 'Features', path: '/features' },
        { text: 'Contact Us', path: '/contact' },
        { text: 'API Documentation', path: '/api' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { text: 'Blog', path: '/' },
        { text: 'Help Center', path: '/contact' },
        { text: 'Community', path: '/contact' },
        { text: 'Tutorials', path: '/features' },
      ]
    },
    {
      title: 'Support',
      links: [
        { text: 'Contact Us', path: '/contact' },
        { text: 'Privacy Policy', path: '/privacy' },
        { text: 'Terms of Service', path: '/about' },
        { text: 'Cookie Policy', path: '/privacy' },
      ]
    }
  ];

  const features = [
    { icon: <Article />, text: 'Rich Content Editor' },
    { icon: <Code />, text: 'Developer Friendly' },
    { icon: <Security />, text: 'Secure & Reliable' },
    { icon: <Speed />, text: 'Fast Performance' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto',
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h5"
                component={RouterLink}
                to="/"
                sx={{
                  textDecoration: 'none',
                  color: 'primary.main',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2,
                }}
              >
                <Article />
                OpenDraft
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                A modern content management platform for writers, creators, and developers. 
                Build, publish, and share your stories with the world.
              </Typography>
              
              {/* Features */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {features.map((feature, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      fontSize: '0.75rem',
                    }}
                  >
                    {feature.icon}
                    <Typography variant="caption" sx={{ fontWeight: 500 }}>
                      {feature.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <Grid item xs={12} sm={6} md={2} key={section.title}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {section.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {section.links.map((link) => (
                  <Box component="li" key={link.text} sx={{ mb: 1 }}>
                    <Link
                      component={RouterLink}
                      to={link.path}
                      sx={{
                        color: 'text.secondary',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        '&:hover': {
                          color: 'primary.main',
                        },
                      }}
                    >
                      {link.text}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: 2,
          }}
        >
          {/* Copyright */}
          <Typography variant="body2" color="text.secondary">
            © {currentYear} OpenDraft. All rights reserved.
          </Typography>

          {/* Social Links */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              component="a"
              href="https://github.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'primary.light',
                },
              }}
            >
              <GitHub />
            </IconButton>
            <IconButton
              size="small"
              component="a"
              href="https://twitter.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'primary.light',
                },
              }}
            >
              <Twitter />
            </IconButton>
            <IconButton
              size="small"
              component="a"
              href="https://linkedin.com/in/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'primary.light',
                },
              }}
            >
              <LinkedIn />
            </IconButton>
            <IconButton
              size="small"
              component="a"
              href="mailto:your@email.com"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'primary.light',
                },
              }}
            >
              <Email />
            </IconButton>
          </Box>
        </Box>

        {/* Made with Love */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, letterSpacing: 1 }}>
            Made with ❤️ using React, Node.js, and MongoDB
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 