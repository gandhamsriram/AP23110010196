/**
 * AllNotifications Page
 * Fetches and displays paginated notifications with type filtering.
 * Shows mock data with a warning banner when API is unavailable.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Alert,
  AlertTitle,
  Button,
  Fade,
  Grow,
  Grid,
  alpha,
  useTheme,
  Skeleton,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import InboxIcon from '@mui/icons-material/Inbox';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { fetchNotifications } from '../services/api';
import NotificationCard from '../components/NotificationCard';
import FilterBar from '../components/FilterBar';
import PaginationControls from '../components/PaginationControls';

const ITEMS_PER_PAGE = 10;

const AllNotifications = ({ readIds, onMarkRead }) => {
  const theme = useTheme();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState('');
  const [isMock, setIsMock] = useState(false);
  const [apiError, setApiError] = useState(null);

  /**
   * Load notifications — API call with automatic mock fallback
   */
  const loadNotifications = useCallback(async (currentPage, type) => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: ITEMS_PER_PAGE };
      if (type) params.notification_type = type;

      const result = await fetchNotifications(params);
      console.log('[AllNotifications] Data loaded:', result);

      setNotifications(result.data);
      setTotalPages(result.total_pages || 1);
      setIsMock(result.isMock);
      setApiError(result.error);
    } catch (err) {
      console.error('[AllNotifications] Unexpected error:', err);
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications(page, filterType);
  }, [page, filterType, loadNotifications]);

  const handleFilterChange = useCallback((type) => {
    setFilterType(type);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleRetry = useCallback(() => {
    loadNotifications(page, filterType);
  }, [loadNotifications, page, filterType]);

  // ──────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <InboxIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Typography
            variant="h4"
            sx={{
              background: 'linear-gradient(135deg, #4F46E5, #0EA5E9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            All Notifications
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', ml: 0.5 }}>
          Browse and filter all campus notifications
        </Typography>
      </Box>



      {/* Filter Bar */}
      <Box
        sx={{
          mb: 3,
          p: 2,
          borderRadius: 3,
          background: alpha(theme.palette.background.paper, 0.5),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.06)}`,
        }}
      >
        <FilterBar selectedType={filterType} onTypeChange={handleFilterChange} />
      </Box>

      {/* Loading Skeletons */}
      {loading && (
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid size={{ xs: 12 }} key={i}>
              <Skeleton
                variant="rounded"
                height={120}
                sx={{ borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.05) }}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty State */}
      {!loading && notifications.length === 0 && (
        <Fade in>
          <Box sx={{ textAlign: 'center', py: 10, px: 3 }}>
            <NotificationsNoneIcon
              sx={{ fontSize: 80, color: alpha(theme.palette.text.secondary, 0.2), mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No Notifications Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filterType
                ? `No ${filterType} notifications available. Try a different filter.`
                : 'There are no notifications to display at this time.'}
            </Typography>
          </Box>
        </Fade>
      )}

      {/* Notification Cards */}
      {!loading && notifications.length > 0 && (
        <>
          <Grid container spacing={2}>
            {notifications.map((notif, index) => (
              <Grid size={{ xs: 12 }} key={notif.id || index}>
                <Grow in timeout={300 + index * 80}>
                  <Box>
                    <NotificationCard
                      notification={notif}
                      isRead={readIds.has(notif.id)}
                      onClick={onMarkRead}
                    />
                  </Box>
                </Grow>
              </Grid>
            ))}
          </Grid>

          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Box>
  );
};

export default AllNotifications;
