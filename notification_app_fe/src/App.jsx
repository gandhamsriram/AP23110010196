/**
 * App.jsx — Root Application Component
 * Sets up the MUI theme, routing, and global read/unread state.
 */
import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Snackbar, Alert, alpha } from '@mui/material';
import theme from './theme';
import Navbar from './components/Navbar';
import AllNotifications from './pages/AllNotifications';
import PriorityInbox from './pages/PriorityInbox';

const App = () => {
  // ──────────────────────────────────────────
  // Global read/unread state (persisted in Set)
  // ──────────────────────────────────────────
  const [readIds, setReadIds] = useState(() => {
    try {
      const saved = localStorage.getItem('campus_notify_read_ids');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  /**
   * Mark a notification as read and persist to localStorage
   */
  const handleMarkRead = useCallback((id) => {
    setReadIds((prev) => {
      if (prev.has(id)) return prev; // Already read
      const next = new Set(prev);
      next.add(id);
      // Persist
      try {
        localStorage.setItem('campus_notify_read_ids', JSON.stringify([...next]));
      } catch (e) {
        console.warn('Failed to persist read state:', e);
      }
      return next;
    });
    setSnackbar({ open: true, message: 'Notification marked as read' });
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            minHeight: '100vh',
            background: `
              radial-gradient(ellipse at 20% 0%, ${alpha('#4F46E5', 0.05)} 0%, transparent 50%),
              radial-gradient(ellipse at 80% 100%, ${alpha('#0EA5E9', 0.04)} 0%, transparent 50%),
              #F8FAFC
            `,
          }}
        >
          <Navbar />

          <Box component="main" sx={{ minHeight: 'calc(100vh - 70px)' }}>
            <Routes>
              <Route
                path="/"
                element={
                  <AllNotifications
                    readIds={readIds}
                    onMarkRead={handleMarkRead}
                  />
                }
              />
              <Route
                path="/priority"
                element={
                  <PriorityInbox
                    readIds={readIds}
                    onMarkRead={handleMarkRead}
                  />
                }
              />
            </Routes>
          </Box>
        </Box>

        {/* Read confirmation snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            variant="filled"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              background: 'linear-gradient(135deg, #4740c6ff, #4A42D4)',
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Router>
    </ThemeProvider>
  );
};

export default App;
