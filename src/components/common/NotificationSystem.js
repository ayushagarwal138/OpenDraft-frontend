import React, { useEffect, useState } from 'react';
import { IconButton, Badge, Menu, MenuItem, ListItemText, ListItemIcon, Typography, CircularProgress, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const pickBaseUrl = (raw, fallback) => {
  const s = (raw || fallback || '').split(/[ ,]+/).filter(Boolean);
  return s[0] || fallback;
};

const API_URL = pickBaseUrl(process.env.REACT_APP_API_URL, 'http://localhost:5001/api');

const NotificationSystem = () => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = (res.data.data || []).map(n => ({ ...n, read: n.isRead }));
      setNotifications(list);
    } catch (err) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    fetchNotifications();
  };
  const handleClose = () => setAnchorEl(null);

  const handleMarkRead = async (id) => {
    const token = localStorage.getItem('token');
    await axios.put(`${API_URL}/notifications/${id}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications((prev) => prev.map(n => n._id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = async () => {
    const token = localStorage.getItem('token');
    await axios.put(`${API_URL}/notifications/mark-all-read`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderNotificationText = (n) => {
    switch (n.type) {
      case 'comment':
        return 'New comment on your post';
      case 'reply':
        return 'New reply to your comment';
      case 'follow':
        return 'New follower';
      case 'reaction':
        return `New reaction: ${n.data.emoji || ''}`;
      default:
        return n.type;
    }
  };

  return (
    <>
      <IconButton color="primary" onClick={handleOpen} sx={{ position: 'relative' }}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ sx: { minWidth: 340 } }}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">Notifications</Typography>
        </MenuItem>
        <MenuItem onClick={handleMarkAllRead} disabled={unreadCount === 0}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <DoneAllIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Mark all as read" />
        </MenuItem>
        <Divider />
        {loading ? (
          <MenuItem><CircularProgress size={20} /></MenuItem>
        ) : notifications.length === 0 ? (
          <MenuItem disabled>No notifications</MenuItem>
        ) : notifications.map((n) => (
          <MenuItem key={n._id} selected={!n.read} sx={{ alignItems: 'flex-start' }}>
            <ListItemText
              primary={renderNotificationText(n)}
              secondary={new Date(n.createdAt).toLocaleString()}
            />
            {!n.read && (
              <ListItemIcon sx={{ minWidth: 32 }}>
                <IconButton size="small" onClick={() => handleMarkRead(n._id)}>
                  <CheckIcon fontSize="small" />
                </IconButton>
              </ListItemIcon>
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default NotificationSystem; 