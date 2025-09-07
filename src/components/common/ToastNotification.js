import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  Box,
  Typography,
  IconButton,
  Slide,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Warning,
  Info,
  Close,
} from '@mui/icons-material';

const ToastNotification = ({ 
  open, 
  message, 
  type = 'info', 
  duration = 4000, 
  onClose,
  position = 'top-right',
  showIcon = true,
  showCloseButton = true,
  autoHide = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
    }
  }, [open]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway' && !autoHide) {
      return;
    }
    setIsVisible(false);
    setTimeout(() => {
      onClose && onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle />;
      case 'error':
        return <Error />;
      case 'warning':
        return <Warning />;
      case 'info':
        return <Info />;
      default:
        return <Info />;
    }
  };

  const getSeverity = () => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  const getPosition = () => {
    switch (position) {
      case 'top-left':
        return { vertical: 'top', horizontal: 'left' };
      case 'top-center':
        return { vertical: 'top', horizontal: 'center' };
      case 'top-right':
        return { vertical: 'top', horizontal: 'right' };
      case 'bottom-left':
        return { vertical: 'bottom', horizontal: 'left' };
      case 'bottom-center':
        return { vertical: 'bottom', horizontal: 'center' };
      case 'bottom-right':
        return { vertical: 'bottom', horizontal: 'right' };
      default:
        return { vertical: 'top', horizontal: 'right' };
    }
  };

  const getAnimation = () => {
    const position = getPosition();
    if (position.vertical === 'top') {
      return (props) => <Slide {...props} direction="down" />;
    }
    return (props) => <Slide {...props} direction="up" />;
  };

  return (
    <Snackbar
      open={isVisible}
      autoHideDuration={autoHide ? duration : null}
      onClose={handleClose}
      anchorOrigin={getPosition()}
      TransitionComponent={getAnimation()}
      sx={{
        '& .MuiSnackbarContent-root': {
          minWidth: '300px',
          maxWidth: '400px',
        },
      }}
    >
      <Alert
        onClose={handleClose}
        severity={getSeverity()}
        variant="filled"
        icon={showIcon ? getIcon() : false}
        action={
          showCloseButton ? (
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <Close fontSize="inherit" />
            </IconButton>
          ) : null
        }
        sx={{
          width: '100%',
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          '& .MuiAlert-message': {
            fontWeight: 500,
          },
        }}
      >
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {message}
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default ToastNotification; 