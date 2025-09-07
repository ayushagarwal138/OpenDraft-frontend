import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Grid,
} from '@mui/material';
import {
  Schedule,
  CalendarToday,
  AccessTime,
  CheckCircle,
} from '@mui/icons-material';

const PostScheduler = ({
  onSchedule,
  scheduledDate,
  onScheduledDateChange,
  onCancel,
  isScheduled = false,
}) => {
  const [date, setDate] = useState(scheduledDate || '');
  const [time, setTime] = useState('12:00');
  const [timezone, setTimezone] = useState('UTC');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSchedule = () => {
    if (!date) {
      return;
    }

    const scheduledDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (scheduledDateTime <= now) {
      return;
    }

    onSchedule({
      scheduledDate: scheduledDateTime,
      timezone,
    });
  };

  const handleCancel = () => {
    setDate('');
    setTime('12:00');
    setTimezone('UTC');
    onCancel && onCancel();
  };

  const getTimeUntilPublish = () => {
    if (!date || !time) return null;

    const scheduledDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const diff = scheduledDateTime - now;

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}, ${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}, ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  };

  const timeUntilPublish = getTimeUntilPublish();
  const isDateValid = date && time && new Date(`${date}T${time}`) > new Date();

  const quickScheduleOptions = [
    { label: '1 hour from now', value: 1 },
    { label: '3 hours from now', value: 3 },
    { label: '6 hours from now', value: 6 },
    { label: 'Tomorrow', value: 24 },
    { label: 'Next week', value: 168 },
  ];

  const handleQuickSchedule = (hours) => {
    const scheduledDate = new Date();
    scheduledDate.setHours(scheduledDate.getHours() + hours);
    
    const dateStr = scheduledDate.toISOString().split('T')[0];
    const timeStr = scheduledDate.toTimeString().slice(0, 5);
    
    setDate(dateStr);
    setTime(timeStr);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Schedule color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6">Schedule Post</Typography>
        {isScheduled && (
          <Chip
            label="Scheduled"
            color="success"
            size="small"
            icon={<CheckCircle />}
            sx={{ ml: 2 }}
          />
        )}
      </Box>

      {/* Quick Schedule Options */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Quick Schedule
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {quickScheduleOptions.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              variant="outlined"
              clickable
              onClick={() => handleQuickSchedule(option.value)}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
      </Grid>

      {/* Advanced Options */}
      <Box sx={{ mt: 3 }}>
        <Button
          size="small"
          onClick={() => setShowAdvanced(!showAdvanced)}
          sx={{ mb: 2 }}
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </Button>
        
        {showAdvanced && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Timezone</InputLabel>
                <Select
                  value={timezone}
                  label="Timezone"
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  <MenuItem value="UTC">UTC</MenuItem>
                  <MenuItem value="America/New_York">Eastern Time</MenuItem>
                  <MenuItem value="America/Chicago">Central Time</MenuItem>
                  <MenuItem value="America/Denver">Mountain Time</MenuItem>
                  <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
                  <MenuItem value="Europe/London">London</MenuItem>
                  <MenuItem value="Europe/Paris">Paris</MenuItem>
                  <MenuItem value="Asia/Tokyo">Tokyo</MenuItem>
                  <MenuItem value="Asia/Shanghai">Shanghai</MenuItem>
                  <MenuItem value="Australia/Sydney">Sydney</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}
      </Box>

      {/* Time Until Publish */}
      {timeUntilPublish && (
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            Post will be published in <strong>{timeUntilPublish}</strong>
          </Typography>
        </Alert>
      )}

      {/* Validation */}
      {date && time && !isDateValid && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          <Typography variant="body2">
            Scheduled time must be in the future
          </Typography>
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleSchedule}
          disabled={!isDateValid}
          startIcon={<Schedule />}
        >
          Schedule Post
        </Button>
        <Button
          variant="outlined"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </Box>

      {/* Scheduled Post Info */}
      {isScheduled && scheduledDate && (
        <Box sx={{ mt: 3, p: 2, backgroundColor: 'success.light', borderRadius: 1 }}>
          <Typography variant="body2" color="success.contrastText">
            <strong>Post scheduled for:</strong> {new Date(scheduledDate).toLocaleString()}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default PostScheduler; 