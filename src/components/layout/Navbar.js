import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button as MUIButton,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,

} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Dashboard,
  Create,
  Person,
  Logout,
  Login,
  PersonAdd,
  Search,
  AdminPanelSettings,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationSystem from '../common/NotificationSystem';
import ThemeToggle from '../common/ThemeToggle';
import Logo from '../common/Logo';
import { Button as ShButton } from '../../components/ui/button';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { text: 'Home', path: '/', icon: <Home /> },
    { text: user?.role === 'admin' ? 'Admin' : 'Dashboard', path: user?.role === 'admin' ? '/admin' : '/dashboard', icon: user?.role === 'admin' ? <AdminPanelSettings /> : <Dashboard />, protected: true },
    ...(user?.role !== 'admin' ? [{ text: 'Create Post', path: '/create-post', icon: <Create />, protected: true }] : []),
  ];

  const renderDesktopNav = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {navItems.map((item) => {
        if (item.protected && !isAuthenticated) return null;
        return (
          <MUIButton
            key={item.text}
            component={RouterLink}
            to={item.path}
            startIcon={item.icon}
            sx={{
              color: isActive(item.path) ? 'primary.main' : 'text.primary',
              fontWeight: isActive(item.path) ? 600 : 400,
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              },
            }}
          >
            {item.text}
          </MUIButton>
        );
      })}
      {isAuthenticated && user?.role !== 'admin' && (
        <RouterLink to="/create-post" style={{ textDecoration: 'none' }}>
          <ShButton className="h-9 px-4 bg-blue-600 text-white hover:bg-blue-700">
            Write
          </ShButton>
        </RouterLink>
      )}
    </Box>
  );

  const renderMobileNav = () => (
    <Drawer
      anchor="left"
      open={mobileOpen}
      onClose={handleMobileMenuToggle}
      PaperProps={{
        sx: {
          width: 280,
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <Logo height="35px" />
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => {
          if (item.protected && !isAuthenticated) return null;
          return (
            <ListItem
              key={item.text}
              button
              component={RouterLink}
              to={item.path}
              onClick={handleMobileMenuToggle}
              sx={{
                backgroundColor: isActive(item.path) ? 'primary.light' : 'transparent',
                color: isActive(item.path) ? 'primary.main' : 'text.primary',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          );
        })}
      </List>
      <Divider />
      {isAuthenticated ? (
        <List>
          <ListItem
            button
            component={RouterLink}
            to="/profile"
            onClick={handleMobileMenuToggle}
          >
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem
            button
            component={RouterLink}
            to="/login"
            onClick={handleMobileMenuToggle}
          >
            <ListItemIcon>
              <Login />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
          <ListItem
            button
            component={RouterLink}
            to="/register"
            onClick={handleMobileMenuToggle}
          >
            <ListItemIcon>
              <PersonAdd />
            </ListItemIcon>
            <ListItemText primary="Register" />
          </ListItem>
        </List>
      )}
    </Drawer>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)', // subtle shadow
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              edge="start"
              color="primary"
              aria-label="menu"
              onClick={handleMobileMenuToggle}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontWeight: 800, // bolder
                fontSize: 22,
                letterSpacing: 1,
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              <Logo height="40px" />
            </Box>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', flex: 1, mx: 4 }}>
            {renderDesktopNav()}
          </Box>

          {/* User Menu / Auth Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <IconButton
                  color="primary"
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                  <Search />
                </IconButton>
                <NotificationSystem />
                <Chip
                  label={user?.role || 'User'}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                  >
                    {user?.name}
                  </Typography>
                  <Avatar
                    onClick={handleProfileMenuOpen}
                    sx={{
                      width: 40,
                      height: 40,
                      cursor: 'pointer',
                      backgroundColor: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  <MenuItem
                    component={RouterLink}
                    to="/profile"
                    onClick={handleProfileMenuClose}
                  >
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    Profile
                  </MenuItem>
                  {user?.role === 'admin' ? (
                    <MenuItem
                      component={RouterLink}
                      to="/admin"
                      onClick={handleProfileMenuClose}
                    >
                      <ListItemIcon>
                        <AdminPanelSettings fontSize="small" />
                      </ListItemIcon>
                      Admin Dashboard
                    </MenuItem>
                  ) : (
                    <MenuItem
                      component={RouterLink}
                      to="/dashboard"
                      onClick={handleProfileMenuClose}
                    >
                      <ListItemIcon>
                        <Dashboard fontSize="small" />
                      </ListItemIcon>
                      Dashboard
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <MUIButton
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  size="small"
                  startIcon={<Login />}
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                  Login
                </MUIButton>
                <MUIButton
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  size="small"
                  startIcon={<PersonAdd />}
                >
                  Register
                </MUIButton>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileNav()}
    </>
  );
};

export default Navbar; 