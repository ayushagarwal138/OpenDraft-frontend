import React from 'react';
import { Container, Box, Typography, Button, Grid, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Landing = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
            Publish. Share. Grow.
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            OpenDraft helps you write, publish, and build your audience with a
            professional blogging experience.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
            <Button component={RouterLink} to="/register" size="large" variant="contained">
              Get Started
            </Button>
            <Button component={RouterLink} to="/login" size="large" variant="outlined">
              Sign In
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              background: 'linear-gradient(135deg, rgba(25,118,210,0.06), rgba(66,165,245,0.06))',
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Why OpenDraft?
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              - Beautiful editor with images, tables, and embeds
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              - SEO, social cards, and scheduled publishing
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              - Followers, reactions, comments, and notifications
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Landing;

