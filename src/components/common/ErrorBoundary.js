import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: 3,
            backgroundColor: 'background.default'
          }}
        >
          <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          
          <Typography variant="h4" component="h1" gutterBottom>
            Oops! Something went wrong
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center', maxWidth: 600 }}>
            We're sorry, but something unexpected happened. Please try refreshing the page.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={this.handleReload}
            sx={{ mb: 3 }}
          >
            Refresh Page
          </Button>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <Alert severity="error" sx={{ maxWidth: 800, width: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Error Details (Development Mode):
              </Typography>
              <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.75rem' }}>
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo.componentStack}
              </Typography>
            </Alert>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
