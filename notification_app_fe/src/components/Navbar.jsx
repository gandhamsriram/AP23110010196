
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  alpha,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import InboxIcon from '@mui/icons-material/Inbox';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

const navItems = [
  { label: 'All Notifications', path: '/', icon: <InboxIcon /> },
  { label: 'Priority Inbox', path: '/priority', icon: <PriorityHighIcon /> },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: alpha(theme.palette.background.default, 0.85),
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
          {/* Brand */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <NotificationsActiveIcon
              sx={{
                fontSize: 30,
                color: 'primary.main',
                filter: 'drop-shadow(0 0 8px rgba(108, 99, 255, 0.5))',
              }}
            />
            <Typography
              variant="h6"
              sx={{
                background: 'linear-gradient(135deg, #6C63FF, #00D9FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              CampusNotify
            </Typography>
          </Box>

          {/* Desktop Nav */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  variant={isActive(item.path) ? 'contained' : 'text'}
                  sx={{
                    color: isActive(item.path) ? '#fff' : 'text.secondary',
                    background: isActive(item.path)
                      ? 'linear-gradient(135deg, #6C63FF, #4A42D4)'
                      : 'transparent',
                    boxShadow: isActive(item.path)
                      ? '0 4px 20px rgba(108, 99, 255, 0.35)'
                      : 'none',
                    '&:hover': {
                      background: isActive(item.path)
                        ? 'linear-gradient(135deg, #7D75FF, #5A52E4)'
                        : alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Mobile Hamburger */}
          {isMobile && (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ color: 'primary.main' }}
              aria-label="open navigation menu"
            >
              <MenuIcon fontSize="large" />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 260,
            background: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <Box sx={{ py: 3, px: 2 }}>
          <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 700 }}>
            Navigation
          </Typography>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    setDrawerOpen(false);
                  }}
                  selected={isActive(item.path)}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      background: alpha(theme.palette.primary.main, 0.15),
                      '&:hover': {
                        background: alpha(theme.palette.primary.main, 0.2),
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive(item.path) ? 700 : 500,
                      color: isActive(item.path) ? 'primary.main' : 'text.primary',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
