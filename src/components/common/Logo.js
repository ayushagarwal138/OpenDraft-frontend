import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import logoPng from '../../assets/logo.png';
// eslint-disable-next-line no-unused-vars
import logoSvg from '../../assets/logo.svg';

const Logo = ({ 
  height = '40px', 
  width = 'auto', 
  showText = true, 
  variant = 'default',
  sx = {} 
}) => {
  const [imageError, setImageError] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  

  // Show text-only version for small sizes
  if (variant === 'text-only') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ...sx }}>
        <Typography 
          variant="h6" 
          component="span"
          sx={{
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
          }}
        >
          OpenDraft
        </Typography>
      </Box>
    );
  }

  // Default: try to load PNG image with fallback
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ...sx }}>
      <img
        src={logoPng}
        alt="OpenDraft Logo"
        style={{
          height,
          width,
          objectFit: 'contain',
          display: imageError ? 'none' : 'block',
        }}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
      {imageError && (
        <Box 
          component="svg"
          viewBox="0 0 200 80" 
          xmlns="http://www.w3.org/2000/svg"
          sx={{ width: height, height }}
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#1976d2', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#42a5f5', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          
          {/* Background circle */}
          <circle cx="40" cy="40" r="35" fill="url(#logoGradient)" opacity="0.1"/>
          
          {/* Main icon - pen/pencil */}
          <path d="M25 55 L45 35 L55 45 L35 65 Z" fill="url(#logoGradient)" stroke="url(#logoGradient)" strokeWidth="2"/>
          <circle cx="30" cy="60" r="3" fill="url(#logoGradient)"/>
          
          {showText && (
            <>
              {/* Text */}
              <text x="85" y="35" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="url(#logoGradient)">Open</text>
              <text x="85" y="55" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#1976d2">Draft</text>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Logo; 