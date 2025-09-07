import React, { useState } from 'react';

import { Container, Box, Typography, Alert, Button, Grid, Card, TextField, Chip } from '@mui/material';import { useNavigate } from 'react-router-dom';
import {
  Email,
  Phone,
  LocationOn,
  Send,
  CheckCircle,
  Support,
  Business,
  Schedule
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  subject: yup.string().required('Subject is required'),
  message: yup.string().min(10, 'Message must be at least 10 characters').required('Message is required'),
}).required();

const Contact = () => {
  
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Form data submitted successfully
      setSubmitted(true);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const contactInfo = [
    {
      icon: <Email />,
      title: 'Email',
      value: 'contact@opendraft.com',
      description: 'Send us an email anytime'
    },
    {
      icon: <Phone />,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 6pm'
    },
    {
      icon: <LocationOn />,
      title: 'Office',
      value: 'San Francisco, CA',
      description: 'Visit us at our office'
    }
  ];

  const supportTopics = [
    'Technical Support',
    'Account Issues',
    'Feature Requests',
    'Bug Reports',
    'Billing Questions',
    'API Documentation'
  ];

  const faqs = [
    {
      question: 'How do I get started with OpenDraft?',
      answer: 'Simply register for a free account and start creating your first post. Our intuitive interface makes it easy to get started.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for enterprise customers.'
    },
    {
      question: 'Can I export my content?',
      answer: 'Yes, you can export your posts in various formats including JSON, Markdown, and HTML.'
    },
    {
      question: 'Is there a mobile app?',
      answer: 'Our web application is fully responsive and works great on mobile devices. We\'re also working on native mobile apps.'
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
          Contact Us
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: 'auto', mb: 4, lineHeight: 1.6 }}
        >
          Have questions or need help? We're here to assist you. 
          Reach out to our team and we'll get back to you as soon as possible.
        </Typography>
      </Box>

      {/* Success Message */}
      {submitted && (
        <Alert 
          severity="success" 
          sx={{ mb: 4 }}
          action={
            <Button color="inherit" size="small" onClick={() => setSubmitted(false)}>
              Close
            </Button>
          }
        >
          Thank you for your message! We'll get back to you within 24 hours.
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Contact Form */}
                      <Grid item xs={12} md={8}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Send us a Message
            </Typography>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Full Name"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Email Address"
                        type="email"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="subject"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Subject"
                        error={!!errors.subject}
                        helperText={errors.subject?.message}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="message"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Message"
                        multiline
                        rows={6}
                        error={!!errors.message}
                        helperText={errors.message?.message}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<Send />}
                    disabled={isSubmitting}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Contact Info Cards */}
            {contactInfo.map((info, index) => (
              <Card key={index} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
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
                    {info.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {info.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {info.description}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {info.value}
                </Typography>
              </Card>
            ))}

            {/* Support Topics */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Support Topics
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {supportTopics.map((topic, index) => (
                  <Chip
                    key={index}
                    label={topic}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                ))}
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* FAQ Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Frequently Asked Questions
        </Typography>
        <Grid container spacing={3}>
          {faqs.map((faq, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {faq.question}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {faq.answer}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Business Hours */}
      <Box sx={{ mt: 6 }}>
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Business Hours
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <Schedule color="primary" />
                <Typography variant="h6">Monday - Friday</Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                8:00 AM - 6:00 PM PST
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <Support color="primary" />
                <Typography variant="h6">Weekend Support</Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                10:00 AM - 4:00 PM PST
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <Business color="primary" />
                <Typography variant="h6">Response Time</Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                Within 24 hours
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Box>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', mt: 6, p: 4, backgroundColor: 'primary.light', borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.contrastText' }}>
          Need Immediate Help?
        </Typography>
        <Typography variant="body1" sx={{ color: 'primary.contrastText', mb: 3 }}>
          Check out our documentation or join our community forum for quick answers.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Chip
            icon={<CheckCircle />}
            label="View Documentation"
            color="primary"
            variant="outlined"
            sx={{ backgroundColor: 'white', cursor: 'pointer' }}
            onClick={() => navigate('/features')}
          />
          <Chip
            icon={<Support />}
            label="Community Forum"
            color="primary"
            variant="outlined"
            sx={{ backgroundColor: 'white', cursor: 'pointer' }}
            onClick={() => navigate('/features')}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Contact; 