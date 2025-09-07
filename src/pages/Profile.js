import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import ImageUpload from '../components/common/ImageUpload';
import { useParams } from 'react-router-dom';
import { getUserById, followUser, unfollowUser, getFollowers, getFollowing } from '../services/userService';

const schema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  bio: yup.string().max(500, 'Bio cannot be more than 500 characters'),
  twitter: yup.string().url('Enter a valid URL').nullable(),
  linkedin: yup.string().url('Enter a valid URL').nullable(),
  github: yup.string().url('Enter a valid URL').nullable(),
  avatar: yup.string().nullable(),
}).required();

const Profile = () => {
  const { user: loggedInUser, updateProfile } = useAuth();
  const { id } = useParams();
  const isSelf = !id || id === loggedInUser?._id;
  const [profileUser, setProfileUser] = useState(isSelf ? loggedInUser : null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);

  // Fetch profile user if viewing another user
  useEffect(() => {
    const fetchProfile = async () => {
      if (isSelf) {
        setProfileUser(loggedInUser);
        setIsFollowing(false);
      } else {
        setLoading(true);
        try {
          const res = await getUserById(id);
          setProfileUser(res.data.data);
          // Check if logged-in user is following
          setIsFollowing(res.data.data.followers?.includes(loggedInUser?._id));
        } catch (err) {
          setError('User not found');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfile();
  }, [id, loggedInUser, isSelf]);

  // Fetch followers/following
  useEffect(() => {
    if (!profileUser?._id) return;
    getFollowers(profileUser._id).then(res => setFollowers(res.data.followers || []));
    getFollowing(profileUser._id).then(res => setFollowing(res.data.following || []));
  }, [profileUser?._id]);

  // Form setup (only for self)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: profileUser?.name || '',
      bio: profileUser?.bio || '',
      twitter: profileUser?.twitter || '',
      linkedin: profileUser?.linkedin || '',
      github: profileUser?.github || '',
      avatar: profileUser?.avatar || '',
    }
  });
  const avatar = watch('avatar');
  useEffect(() => {
    if (profileUser) {
      setValue('name', profileUser.name || '');
      setValue('bio', profileUser.bio || '');
      setValue('twitter', profileUser.twitter || '');
      setValue('linkedin', profileUser.linkedin || '');
      setValue('github', profileUser.github || '');
      setValue('avatar', profileUser.avatar || '');
    }
  }, [profileUser, setValue]);

  const handleAvatarChange = (url) => {
    setValue('avatar', url, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const result = await updateProfile(data);
      if (result.success) {
        setSuccess('Profile updated successfully!');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Follow/Unfollow handlers
  const handleFollow = async () => {
    try {
      await followUser(profileUser._id);
      setIsFollowing(true);
      setFollowers(prev => [...prev, loggedInUser]);
    } catch (err) {
      setError('Failed to follow user');
    }
  };
  const handleUnfollow = async () => {
    try {
      await unfollowUser(profileUser._id);
      setIsFollowing(false);
      setFollowers(prev => prev.filter(f => f._id !== loggedInUser._id));
    } catch (err) {
      setError('Failed to unfollow user');
    }
  };

  if (loading || !profileUser) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh"><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile
      </Typography>
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <Grid container spacing={3}>
        {/* Profile Information (editable if self) */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>Profile Information</Typography>
            {isSelf ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar src={avatar} alt="avatar" sx={{ width: 64, height: 64 }} />
                  <ImageUpload onUpload={handleAvatarChange} currentImage={avatar} />
                </Box>
                <TextField {...register('name')} fullWidth label="Full Name" margin="normal" error={!!errors.name} helperText={errors.name?.message} disabled={loading} />
                <TextField {...register('bio')} fullWidth label="Bio" margin="normal" multiline rows={4} error={!!errors.bio} helperText={errors.bio?.message} disabled={loading} />
                <TextField {...register('twitter')} fullWidth label="Twitter URL" margin="normal" error={!!errors.twitter} helperText={errors.twitter?.message} disabled={loading} />
                <TextField {...register('linkedin')} fullWidth label="LinkedIn URL" margin="normal" error={!!errors.linkedin} helperText={errors.linkedin?.message} disabled={loading} />
                <TextField {...register('github')} fullWidth label="GitHub URL" margin="normal" error={!!errors.github} helperText={errors.github?.message} disabled={loading} />
                <Button type="submit" variant="contained" size="large" sx={{ mt: 3 }} disabled={loading}>{loading ? <CircularProgress size={24} /> : 'Update Profile'}</Button>
              </form>
            ) : (
              <Box>
                <Typography variant="body1" sx={{ mb: 2 }}>{profileUser.bio}</Typography>
                {/* Social Links */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  {profileUser.twitter && <a href={profileUser.twitter} target="_blank" rel="noopener noreferrer"><img src="/assets/twitter.svg" alt="Twitter" width={24} height={24} /></a>}
                  {profileUser.linkedin && <a href={profileUser.linkedin} target="_blank" rel="noopener noreferrer"><img src="/assets/linkedin.svg" alt="LinkedIn" width={24} height={24} /></a>}
                  {profileUser.github && <a href={profileUser.github} target="_blank" rel="noopener noreferrer"><img src="/assets/github.svg" alt="GitHub" width={24} height={24} /></a>}
                </Box>
                {/* Follow/Unfollow Button */}
                {loggedInUser && (
                  isFollowing ?
                    <Button variant="outlined" color="secondary" onClick={handleUnfollow}>Unfollow</Button>
                    : <Button variant="contained" color="primary" onClick={handleFollow}>Follow</Button>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
        {/* Profile Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar src={profileUser.avatar} alt={profileUser.name} sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }} />
              <Typography variant="h6" gutterBottom>{profileUser.name}</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>{profileUser.email}</Typography>
              <Typography variant="body2" color="text.secondary">Role: {profileUser.role}</Typography>
              {/* Follower/Following Counts */}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button size="small" onClick={() => setFollowersOpen(true)}>{followers.length} Followers</Button>
                <Button size="small" onClick={() => setFollowingOpen(true)}>{following.length} Following</Button>
              </Box>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Account Information</Typography>
              <Typography variant="body2" color="text.secondary">Member since: {new Date(profileUser.createdAt).toLocaleDateString()}</Typography>
              <Typography variant="body2" color="text.secondary">Last login: {new Date(profileUser.lastLogin).toLocaleDateString()}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {/* Followers Modal */}
      {/* Following Modal */}
    </Container>
  );
};

export default Profile; 