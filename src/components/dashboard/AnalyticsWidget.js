import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';

const AnalyticsWidget = ({ title, value, change, icon, color, maxValue, showProgress = false }) => {
  
  const isPositive = change >= 0;
  const changeColor = isPositive ? 'success.main' : 'error.main';
  const changeIcon = isPositive ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: `${color}.light`,
              color: `${color}.main`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          <Chip
            label={`${isPositive ? '+' : ''}${change}%`}
            size="small"
            icon={changeIcon}
            sx={{
              backgroundColor: `${changeColor}20`,
              color: changeColor,
              fontWeight: 600,
            }}
          />
        </Box>
        
        <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
          {value}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {title}
        </Typography>

        {showProgress && maxValue && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {Math.round((value / maxValue) * 100)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(value / maxValue) * 100}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: `${color}.light`,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: `${color}.main`,
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsWidget; 