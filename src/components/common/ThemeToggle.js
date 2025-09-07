import React, { useState } from 'react';
import {
  IconButton,
  Tooltip,
  Box,
  Popover,
  Typography,
  Grid,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  LightMode,
  DarkMode,
  Palette,
  Check,
} from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';

const colorOptions = [
  { name: 'Blue', value: '#1976d2' },
  { name: 'Purple', value: '#7b1fa2' },
  { name: 'Green', value: '#388e3c' },
  { name: 'Orange', value: '#f57c00' },
  { name: 'Red', value: '#d32f2f' },
  { name: 'Teal', value: '#00796b' },
  { name: 'Pink', value: '#c2185b' },
  { name: 'Indigo', value: '#3f51b5' },
];

const ThemeToggle = () => {
  const { primaryColor, toggleTheme, changePrimaryColor, isDark } = useTheme();
  const muiTheme = useMuiTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleColorClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleColorClose = () => {
    setAnchorEl(null);
  };

  const handleColorSelect = (color) => {
    changePrimaryColor(color);
    handleColorClose();
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {/* Theme Toggle */}
      <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
        <IconButton
          onClick={toggleTheme}
          sx={{
            color: muiTheme.palette.text.primary,
            backgroundColor: muiTheme.palette.background.paper,
            border: `1px solid ${muiTheme.palette.divider}`,
            '&:hover': {
              backgroundColor: muiTheme.palette.action.hover,
            },
          }}
        >
          {isDark ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Tooltip>

      {/* Color Picker */}
      <Tooltip title="Change theme color">
        <IconButton
          onClick={handleColorClick}
          sx={{
            color: muiTheme.palette.text.primary,
            backgroundColor: muiTheme.palette.background.paper,
            border: `1px solid ${muiTheme.palette.divider}`,
            '&:hover': {
              backgroundColor: muiTheme.palette.action.hover,
            },
          }}
        >
          <Palette />
        </IconButton>
      </Tooltip>

      {/* Color Picker Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleColorClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            p: 2,
            minWidth: 200,
            backgroundColor: muiTheme.palette.background.paper,
            border: `1px solid ${muiTheme.palette.divider}`,
          },
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
          Choose Theme Color
        </Typography>
        <Grid container spacing={1}>
          {colorOptions.map((color) => (
            <Grid item key={color.value}>
              <Tooltip title={color.name}>
                <Box
                  onClick={() => handleColorSelect(color.value)}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: color.value,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${muiTheme.palette.divider}`,
                    '&:hover': {
                      transform: 'scale(1.1)',
                      transition: 'transform 0.2s',
                    },
                    ...(primaryColor === color.value && {
                      border: `2px solid ${muiTheme.palette.primary.main}`,
                      boxShadow: `0 0 0 2px ${muiTheme.palette.background.paper}`,
                    }),
                  }}
                >
                  {primaryColor === color.value && (
                    <Check sx={{ color: 'white', fontSize: 20 }} />
                  )}
                </Box>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </Popover>
    </Box>
  );
};

export default ThemeToggle; 