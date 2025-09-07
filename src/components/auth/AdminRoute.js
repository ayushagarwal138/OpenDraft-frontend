import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box, Alert, Container } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user || user.role !== 'admin') {
    // Show access denied message
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Access Denied. Admin privileges required.
        </Alert>
        <Navigate to="/dashboard" replace />
      </Container>
    );
  }

  return children;
};

export default AdminRoute; 