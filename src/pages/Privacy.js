import React from 'react';

import { Container, Box, Typography, Card, List, ListItem, ListItemText } from '@mui/material';import {
  Security,
  Lock,
  Visibility,
  DataUsage,
  Cookie,
  Shield
} from '@mui/icons-material';

const Privacy = () => {
  

  const sections = [
    {
      title: 'Information We Collect',
      icon: <DataUsage />,
      content: [
        'Personal information (name, email, profile data)',
        'Content you create and publish',
        'Usage data and analytics',
        'Device and browser information',
        'Cookies and tracking technologies'
      ]
    },
    {
      title: 'How We Use Your Information',
      icon: <Visibility />,
      content: [
        'Provide and maintain our services',
        'Process your content and publications',
        'Send you important updates and notifications',
        'Improve our platform and user experience',
        'Ensure security and prevent fraud'
      ]
    },
    {
      title: 'Data Security',
      icon: <Security />,
      content: [
        'Encryption of sensitive data',
        'Secure data transmission (HTTPS)',
        'Regular security audits',
        'Access controls and authentication',
        'Data backup and recovery procedures'
      ]
    },
    {
      title: 'Your Rights',
      icon: <Shield />,
      content: [
        'Access your personal data',
        'Request data correction or deletion',
        'Export your content',
        'Opt-out of marketing communications',
        'Control cookie preferences'
      ]
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
          Privacy Policy
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: 'auto', mb: 4, lineHeight: 1.6 }}
        >
          Your privacy is important to us. This policy explains how we collect, use, 
          and protect your personal information when you use OpenDraft.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Last updated: {new Date().toLocaleDateString()}
        </Typography>
      </Box>

      {/* Introduction */}
      <Card sx={{ mb: 4, p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Introduction
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          OpenDraft ("we," "our," or "us") is committed to protecting your privacy. 
          This Privacy Policy explains how we collect, use, disclose, and safeguard 
          your information when you use our content management platform.
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          By using OpenDraft, you agree to the collection and use of information in 
          accordance with this policy. If you do not agree with our policies and practices, 
          please do not use our service.
        </Typography>
      </Card>

      {/* Policy Sections */}
      <Box sx={{ mb: 4 }}>
        {sections.map((section, index) => (
          <Card key={index} sx={{ mb: 3, p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: 'primary.light',
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {section.icon}
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {section.title}
              </Typography>
            </Box>
            <List dense>
              {section.content.map((item, idx) => (
                <ListItem key={idx} sx={{ px: 0 }}>
                  <ListItemText 
                    primary={item}
                    sx={{ 
                      '& .MuiListItemText-primary': {
                        fontSize: '1rem',
                        lineHeight: 1.6
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Card>
        ))}
      </Box>

      {/* Cookies Policy */}
      <Card sx={{ mb: 4, p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: 'primary.light',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Cookie />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Cookies and Tracking
          </Typography>
        </Box>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          We use cookies and similar tracking technologies to enhance your experience 
          on our platform. These technologies help us:
        </Typography>
        <List dense>
          <ListItem sx={{ px: 0 }}>
            <ListItemText primary="Remember your preferences and settings" />
          </ListItem>
          <ListItem sx={{ px: 0 }}>
            <ListItemText primary="Analyze how you use our platform" />
          </ListItem>
          <ListItem sx={{ px: 0 }}>
            <ListItemText primary="Provide personalized content and features" />
          </ListItem>
          <ListItem sx={{ px: 0 }}>
            <ListItemText primary="Ensure security and prevent fraud" />
          </ListItem>
        </List>
        <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.8 }}>
          You can control cookie settings through your browser preferences. 
          However, disabling certain cookies may affect the functionality of our platform.
        </Typography>
      </Card>

      {/* Data Retention */}
      <Card sx={{ mb: 4, p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: 'primary.light',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Lock />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Data Retention and Deletion
          </Typography>
        </Box>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          We retain your personal information for as long as necessary to provide 
          our services and fulfill the purposes outlined in this policy. You can 
          request deletion of your account and associated data at any time.
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          When you delete your account, we will remove your personal information 
          from our active databases. However, some information may be retained 
          for legal, security, or business purposes as required by law.
        </Typography>
      </Card>

      {/* Contact Information */}
      <Card sx={{ mb: 4, p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Contact Us
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
          If you have any questions about this Privacy Policy or our data practices, 
          please contact us:
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Email: privacy@opendraft.com
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Address: OpenDraft Inc., San Francisco, CA
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Phone: +1 (555) 123-4567
          </Typography>
        </Box>
      </Card>

      {/* Updates */}
      <Card sx={{ p: 4, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Policy Updates
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
          We may update this Privacy Policy from time to time. We will notify you 
          of any changes by posting the new Privacy Policy on this page and updating 
          the "Last updated" date. We encourage you to review this policy periodically 
          to stay informed about how we protect your information.
        </Typography>
      </Card>
    </Container>
  );
};

export default Privacy; 