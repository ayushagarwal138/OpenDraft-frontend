import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container, Box, Tabs, Tab, Avatar, List, ListItem, ListItemAvatar, ListItemText, Paper, CircularProgress, Typography } from '@mui/material';
import { getFollowers, getFollowing, getUserById } from '../services/userService';

const Connections = () => {
  const { id } = useParams();
  const location = useLocation();
  const [tab, setTab] = useState(location.pathname.endsWith('/following') ? 1 : 0);
  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [u, f1, f2] = await Promise.all([
          getUserById(id),
          getFollowers(id),
          getFollowing(id),
        ]);
        setUser(u.data.data);
        setFollowers(f1.data.followers || []);
        setFollowing(f2.data.following || []);
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh"><CircularProgress /></Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>{user?.name}'s Connections</Typography>
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} centered>
          <Tab label={`Followers (${followers.length})`} />
          <Tab label={`Following (${following.length})`} />
        </Tabs>
      </Paper>
      <Paper>
        <List>
          {(tab === 0 ? followers : following).map(u => (
            <ListItem key={u._id} button component="a" href={`/profile/${u._id}`}>
              <ListItemAvatar><Avatar src={u.avatar} /></ListItemAvatar>
              <ListItemText primary={u.name} />
            </ListItem>
          ))}
          {(tab === 0 ? followers : following).length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">No users found.</Typography>
            </Box>
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default Connections;
